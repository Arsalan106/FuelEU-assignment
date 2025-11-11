import type { BankRepository } from "../ports/bank-repo.js";

export class BankSurplus {
  constructor(private bankRepo: BankRepository) {}

  async execute(shipId: string, year: number, cb_gco2eq: number) {
    if (cb_gco2eq <= 0) {
      throw new Error("Only positive CB can be banked");
    }
    return this.bankRepo.add(shipId, year, cb_gco2eq);
  }
}
