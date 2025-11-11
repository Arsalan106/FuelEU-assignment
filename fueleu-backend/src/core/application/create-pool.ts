import type { PoolRepository } from "../ports/pool-repo.js";

type Member = { ship_id: string; cb_before: number; cb_after?: number };

export class CreatePool {
  constructor(private poolRepo: PoolRepository) {}

  /**
   * Greedy allocation:
   * - Sort members desc by cb_before (surplus first)
   * - Transfer surplus to deficits sequentially
   * Constraints:
   * - Sum CB must be >= 0
   * - Deficit ship cannot exit worse
   * - Surplus ship cannot exit negative
   */
  async execute(year: number, members: Member[]) {
    const sum = members.reduce((a, m) => a + m.cb_before, 0);
    if (sum < 0) throw new Error("Total CB across pool must be non-negative");

    const surplus = members.filter(m => m.cb_before > 0).sort((a,b)=>b.cb_before-a.cb_before);
    const deficits = members.filter(m => m.cb_before < 0).sort((a,b)=>a.cb_before-b.cb_before); // most negative first

    const afterMap = new Map<string, number>();
    for (const m of members) afterMap.set(m.ship_id, m.cb_before);

    // transfer from surplus to deficits
    for (const s of surplus) {
      let sRemain = afterMap.get(s.ship_id)!;
      for (const d of deficits) {
        let dRemain = afterMap.get(d.ship_id)!;
        if (sRemain <= 0) break;
        if (dRemain >= 0) continue;
        const transfer = Math.min(sRemain, -dRemain);
        sRemain -= transfer;
        dRemain += transfer;
        afterMap.set(s.ship_id, sRemain);
        afterMap.set(d.ship_id, dRemain);
      }
    }

    // constraints check
    for (const m of members) {
      const before = m.cb_before;
      const after = afterMap.get(m.ship_id)!;
      if (before < 0 && after < before) {
        throw new Error(`Deficit ship ${m.ship_id} cannot exit worse`);
      }
      if (before > 0 && after < 0) {
        throw new Error(`Surplus ship ${m.ship_id} cannot exit negative`);
      }
    }

    const payload = members.map(m => ({
      ship_id: m.ship_id,
      cb_before: m.cb_before,
      cb_after: afterMap.get(m.ship_id)!
    }));

    return this.poolRepo.create(year, payload);
  }
}
