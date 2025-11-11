  import { ComputeCB } from "../../src/core/application/compute-cb.js";
import { TARGET_INTENSITY_2025, MJ_PER_TONNE_FUEL } from "../../src/shared/constants.js";

const mockRepo = {
  saveSnapshot: jest.fn(async (_sid: string, _y: number, cb: number) => ({ id:1, ship_id:"S1", year:2025, cb_gco2eq: cb, created_at: new Date() })),
  findLatest: jest.fn()
};

describe("ComputeCB", () => {
  it("computes positive CB for actual < target", async () => {
    const uc = new ComputeCB(mockRepo as any);
    const out = await uc.execute({ shipId: "S1", year: 2025, actualIntensity_g_per_MJ: TARGET_INTENSITY_2025 - 1, fuelConsumed_tonnes: 1 });
    expect(out.cb_gco2eq).toBeCloseTo(1 * MJ_PER_TONNE_FUEL);
  });
});
