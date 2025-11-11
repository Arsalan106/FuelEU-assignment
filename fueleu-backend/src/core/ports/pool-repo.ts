import type { Pool, PoolMember } from "../domain/entities.js";

export interface PoolRepository {
  create(year: number, members: Array<{ ship_id: string; cb_before: number; cb_after: number }>): Promise<Pool>;
}
