import type { BankEntry } from "../domain/entities.js";

export interface BankRepository {
  list(ship_id: string, year?: number): Promise<BankEntry[]>;
  totalAvailable(ship_id: string, upToYear?: number): Promise<number>;
  add(ship_id: string, year: number, amount: number): Promise<BankEntry>;
  apply(ship_id: string, year: number, amount: number): Promise<BankEntry>; // store negative when applying
}
