import type { RouteRepository } from "../ports/route-repo.js";

export class ComputeComparison {
  constructor(private routeRepo: RouteRepository) {}

  async execute(year: number) {
    const baseline = await this.routeRepo.getBaseline(year);
    const all = await this.routeRepo.findByYear(year);
    if (!baseline) {
      return all.map(r => ({ ...r, percentDiff: null as number | null, compliant: null as boolean | null }));
    }
    return all.map(r => {
      const percentDiff = ((r.ghg_intensity - baseline.ghg_intensity) / baseline.ghg_intensity) * 100;
      const compliant = r.ghg_intensity <= baseline.ghg_intensity;
      return { ...r, percentDiff, compliant };
    });
  }
}
