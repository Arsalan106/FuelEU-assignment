import type { TransactionManager } from "../../../core/ports/tx.js";
import { prisma } from "./prismaClient.js";

export class PrismaTx implements TransactionManager {
  async runInTx<T>(fn: () => Promise<T>): Promise<T> {
    return prisma.$transaction(async () => fn());
  }
}
