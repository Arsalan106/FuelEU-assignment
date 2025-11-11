import type { PoolRepository } from "../../../core/ports/pool-repo.js";
import type { Pool } from "../../../core/domain/entities.js";
import { prisma } from "./prismaClient.js";

export class PoolRepositoryPrisma implements PoolRepository {
  async create(year: number, members: Array<{ ship_id: string; cb_before: number; cb_after: number }>): Promise<Pool> {
    const pool = await prisma.pools.create({
      data: {
        year,
        members: {
          create: members.map(m => ({
            ship_id: m.ship_id,
            cb_before: m.cb_before,
            cb_after: m.cb_after
          }))
        }
      },
      include: { members: true }
    });
    return pool as any;
  }
}
