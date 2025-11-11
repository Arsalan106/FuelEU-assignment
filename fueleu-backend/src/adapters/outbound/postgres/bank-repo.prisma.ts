import type { BankRepository } from "../../../core/ports/bank-repo.js";
import type { BankEntry } from "../../../core/domain/entities.js";
import { prisma } from "./prismaClient.js";

export class BankRepositoryPrisma implements BankRepository {
  async list(ship_id: string, year?: number): Promise<BankEntry[]> {
    return (await prisma.bank_entries.findMany({
      where: { ship_id, ...(year ? { year } : {}) },
      orderBy: { created_at: "desc" }
    })) as any;
  }

  async totalAvailable(ship_id: string, upToYear?: number): Promise<number> {
    const entries = await prisma.bank_entries.findMany({
      where: { ship_id, ...(upToYear ? { year: { lte: upToYear } } : {}) }
    });
    return entries.reduce((sum, e) => sum + e.amount_gco2eq, 0);
  }

  async add(ship_id: string, year: number, amount: number): Promise<BankEntry> {
    return (await prisma.bank_entries.create({
      data: { ship_id, year, amount_gco2eq: amount }
    })) as any;
  }

  async apply(ship_id: string, year: number, amount: number): Promise<BankEntry> {
    // store as negative entry to reflect debit
    return (await prisma.bank_entries.create({
      data: { ship_id, year, amount_gco2eq: -Math.abs(amount) }
    })) as any;
  }
}
