import type { Route } from "../domain/entities.js";

export interface RouteRepository {
  findAll(): Promise<Route[]>;
  setBaseline(id: number): Promise<void>;
  getBaseline(year: number): Promise<Route | null>;
  findByYear(year: number): Promise<Route[]>;
}
