import type { RouteRepository } from "../../../core/ports/route-repo.js";
import type { Route } from "../../../core/domain/entities.js";
import { prisma } from "./prismaClient.js";

export class RouteRepositoryPrisma implements RouteRepository {
  async findAll(): Promise<Route[]> {
    return prisma.routes.findMany({ orderBy: [{ year: "desc" }, { route_id: "asc" }] }) as any;
  }

  async setBaseline(id: number): Promise<void> {
    const target = await prisma.routes.findUnique({ where: { id } });
    if (!target) throw new Error("Route not found");
    await prisma.$transaction([
      prisma.routes.updateMany({ where: { year: target.year }, data: { is_baseline: false } }),
      prisma.routes.update({ where: { id }, data: { is_baseline: true } })
    ]);
  }

  async getBaseline(year: number): Promise<Route | null> {
    return (await prisma.routes.findFirst({ where: { year, is_baseline: true } })) as any;
  }

  async findByYear(year: number): Promise<Route[]> {
    return (await prisma.routes.findMany({ where: { year } })) as any;
  }
}
