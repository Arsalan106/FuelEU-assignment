import { TARGET_INTENSITY_2025, MJ_PER_TONNE_FUEL } from "../../shared/constants.js";
import type { ComplianceRepository } from "../ports/compliance-repo.js";

export type ComputeCBInput = {
  shipId: string;
  year: number;
  actualIntensity_g_per_MJ: number; // gCO2e/MJ
  fuelConsumed_tonnes: number; // t
};

export class ComputeCB {
  constructor(private complianceRepo: ComplianceRepository) {}

  async execute(input: ComputeCBInput) {
    const target = TARGET_INTENSITY_2025;
    const energyMJ = input.fuelConsumed_tonnes * MJ_PER_TONNE_FUEL;
    const cb = (target - input.actualIntensity_g_per_MJ) * energyMJ; // gCO2e
    const snapshot = await this.complianceRepo.saveSnapshot(input.shipId, input.year, cb);
    return { cb_gco2eq: cb, snapshot };
  }
}
