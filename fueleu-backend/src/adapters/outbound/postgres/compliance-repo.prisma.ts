import type { ComplianceRepository } from "../../../core/ports/compliance-repo.js";
import type { ShipCompliance } from "../../../core/domain/entities.js";
import { prisma } from "./prismaClient.js";

export class ComplianceRepositoryPrisma implements ComplianceRepository {
  async saveSnapshot(ship_id: string, year: number, cb_gco2eq: number): Promise<ShipCompliance> {
    return (await prisma.ship_compliance.create({
      data: { ship_id, year, cb_gco2eq }
    })) as any;
  }

  async findLatest(ship_id: string, year: number): Promise<ShipCompliance | null> {
    return (await prisma.ship_compliance.findFirst({
      where: { ship_id, year },
      orderBy: { created_at: "desc" }
    })) as any;
  }
}
