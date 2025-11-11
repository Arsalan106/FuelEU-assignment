import { API_URL } from "../../shared/config";
import type { Route, ComparisonRow, BankEntry } from "../../core/ports";

async function j<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      msg = body.error ?? JSON.stringify(body);
    } catch {}
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export const api = {
  async listRoutes(): Promise<Route[]> {
    return j<Route[]>(await fetch(`${API_URL}/routes`));
  },
  async setBaseline(id: number): Promise<void> {
    await j(await fetch(`${API_URL}/routes/${id}/baseline`, { method: "POST" }));
  },
  async comparison(year: number): Promise<ComparisonRow[]> {
    return j(await fetch(`${API_URL}/routes/comparison?year=${year}`));
  },
  async computeCB(params: { shipId: string; year: number; intensity: number; fuelT: number }) {
    const q = new URLSearchParams({
      shipId: params.shipId,
      year: String(params.year),
      intensity: String(params.intensity),
      fuelT: String(params.fuelT)
    });
    return j<{ cb_gco2eq: number; snapshot: any }>(await fetch(`${API_URL}/compliance/cb?${q.toString()}`));
  },
  async adjustedCB(shipId: string, year: number) {
    const q = new URLSearchParams({ shipId, year: String(year) });
    return j<{ base_cb: number; banked_net: number; adjusted_cb: number }>(await fetch(`${API_URL}/compliance/adjusted-cb?${q.toString()}`));
  },
  async listBank(shipId: string, year?: number) {
    const qs = new URLSearchParams({ shipId, ...(year ? { year: String(year) } : {}) });
    return j<BankEntry[]>(await fetch(`${API_URL}/banking/records?${qs.toString()}`));
  },
  async bank(shipId: string, year: number, cb: number) {
    return j(await fetch(`${API_URL}/banking/bank`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shipId, year, cb })
    }));
  },
  async apply(shipId: string, year: number, amount: number) {
    return j(await fetch(`${API_URL}/banking/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shipId, year, amount })
    }));
  },
  async createPool(year: number, members: Array<{ ship_id: string; cb_before: number }>) {
    return j(await fetch(`${API_URL}/pools`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year, members })
    }));
  }
};
