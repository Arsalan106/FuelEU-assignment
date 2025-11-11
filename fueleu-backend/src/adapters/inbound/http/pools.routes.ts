import { Router } from "express";
import { PoolRepositoryPrisma } from "../../outbound/postgres/pool-repo.prisma.js";
import { CreatePool } from "../../../core/application/create-pool.js";

export const poolsRouter = Router();
const poolRepo = new PoolRepositoryPrisma();
const createPool = new CreatePool(poolRepo);

// POST /pools { year, members: [{ship_id, cb_before}] }
poolsRouter.post("/", async (req, res) => {
  const { year, members } = req.body ?? {};
  if (!Number.isFinite(year) || !Array.isArray(members)) {
    return res.status(400).json({ error: "year (number) and members (array) required" });
  }
  try {
    const pool = await createPool.execute(Number(year), members);
    res.json(pool);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});
