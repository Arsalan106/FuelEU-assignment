import type { ShipCompliance } from "../domain/entities.js";

export interface ComplianceRepository {
  saveSnapshot(ship_id: string, year: number, cb_gco2eq: number): Promise<ShipCompliance>;
  findLatest(ship_id: string, year: number): Promise<ShipCompliance | null>;
}
