import { Router } from "express";
import { BankRepositoryPrisma } from "../../outbound/postgres/bank-repo.prisma.js";
import { BankSurplus } from "../../../core/application/bank-surplus.js";
import { ApplyBanked } from "../../../core/application/apply-banked.js";
import { PrismaTx } from "../../outbound/postgres/tx.prisma.js";

const bankRepo = new BankRepositoryPrisma();
const bankSurplus = new BankSurplus(bankRepo);
const applyBanked = new ApplyBanked(bankRepo, new PrismaTx());

export const bankingRouter = Router();

// GET /banking/records?shipId&year
bankingRouter.get("/records", async (req, res) => {
  const shipId = String(req.query.shipId);
  const year = req.query.year ? Number(req.query.year) : undefined;
  const list = await bankRepo.list(shipId, year);
  res.json(list);
});

// POST /banking/bank { shipId, year, cb }
bankingRouter.post("/bank", async (req, res) => {
  const { shipId, year, cb } = req.body ?? {};
  if (!shipId || !Number.isFinite(year) || !Number.isFinite(cb)) {
    return res.status(400).json({ error: "shipId, year, cb required" });
  }
  try {
    const entry = await bankSurplus.execute(String(shipId), Number(year), Number(cb));
    res.json(entry);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// POST /banking/apply { shipId, year, amount }
bankingRouter.post("/apply", async (req, res) => {
  const { shipId, year, amount } = req.body ?? {};
  if (!shipId || !Number.isFinite(year) || !Number.isFinite(amount)) {
    return res.status(400).json({ error: "shipId, year, amount required" });
  }
  try {
    const entry = await applyBanked.execute(String(shipId), Number(year), Number(amount));
    res.json(entry);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});
