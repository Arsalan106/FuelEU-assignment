import { Router } from "express";
import { RouteRepositoryPrisma } from "../../outbound/postgres/route-repo.prisma.js";
import { ComputeComparison } from "../../../core/application/compare-routes.js";

const repo = new RouteRepositoryPrisma();
const comparison = new ComputeComparison(repo);

export const routesRouter = Router();

routesRouter.get("/", async (_req, res) => {
  const all = await repo.findAll();
  res.json(all);
});

routesRouter.post("/:id/baseline", async (req, res) => {
  const id = Number(req.params.id);
  await repo.setBaseline(id);
  res.json({ ok: true });
});

routesRouter.get("/comparison", async (req, res) => {
  const year = Number(req.query.year ?? 2025);
  const data = await comparison.execute(year);
  res.json(data);
});
