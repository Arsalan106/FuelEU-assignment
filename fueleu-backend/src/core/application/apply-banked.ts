import type { BankRepository } from "../ports/bank-repo.js";
import type { TransactionManager } from "../ports/tx.js";

export class ApplyBanked {
  constructor(private bankRepo: BankRepository, private tx: TransactionManager) {}

  async execute(shipId: string, year: number, amount: number) {
    if (amount <= 0) throw new Error("Amount must be positive");
    const available = await this.bankRepo.totalAvailable(shipId, year);
    if (amount > available) throw new Error("Amount exceeds available banked surplus");
    return this.tx.runInTx(async () => {
      // Store as negative entry to reflect application
      return this.bankRepo.apply(shipId, year, amount);
    });
  }
}
