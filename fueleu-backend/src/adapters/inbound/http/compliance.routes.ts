import { Router } from "express";
import { ComplianceRepositoryPrisma } from "../../outbound/postgres/compliance-repo.prisma.js";
import { BankRepositoryPrisma } from "../../outbound/postgres/bank-repo.prisma.js";
import { ComputeCB } from "../../../core/application/compute-cb.js";
import { PrismaTx } from "../../outbound/postgres/tx.prisma.js";
import { ApplyBanked } from "../../../core/application/apply-banked.js";

export const complianceRouter = Router();
const complianceRepo = new ComplianceRepositoryPrisma();
const bankRepo = new BankRepositoryPrisma();
const computeCB = new ComputeCB(complianceRepo);
const applyBanked = new ApplyBanked(bankRepo, new PrismaTx());

// GET /compliance/cb?shipId&year&intensity&fuelT
complianceRouter.get("/cb", async (req, res) => {
  const shipId = String(req.query.shipId);
  const year = Number(req.query.year ?? 2025);
  const actual = Number(req.query.intensity); // g/MJ
  const fuelT = Number(req.query.fuelT); // tonnes
  if (!shipId || !Number.isFinite(actual) || !Number.isFinite(fuelT)) {
    return res.status(400).json({ error: "Query: shipId, year, intensity (g/MJ), fuelT (t) required" });
  }
  const out = await computeCB.execute({ shipId, year, actualIntensity_g_per_MJ: actual, fuelConsumed_tonnes: fuelT });
  res.json(out);
});

// GET /compliance/adjusted-cb?shipId&year
complianceRouter.get("/adjusted-cb", async (req, res) => {
  const shipId = String(req.query.shipId);
  const year = Number(req.query.year ?? 2025);
  const snap = await complianceRepo.findLatest(shipId, year);
  const available = await bankRepo.totalAvailable(shipId, year);
  const adjusted = (snap?.cb_gco2eq ?? 0) + available;
  res.json({ base_cb: snap?.cb_gco2eq ?? 0, banked_net: available, adjusted_cb: adjusted });
});

// POST /banking/apply via /compliance for convenience? (kept under /banking proper)
