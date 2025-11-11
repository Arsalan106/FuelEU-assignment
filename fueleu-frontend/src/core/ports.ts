export interface Route {
  id: number;
  route_id: string;
  year: number;
  ghg_intensity: number;
  is_baseline: boolean;
}

export interface ComparisonRow extends Route {
  percentDiff: number | null;
  compliant: boolean | null;
}

export interface BankEntry {
  id: number;
  ship_id: string;
  year: number;
  amount_gco2eq: number;
  created_at: string;
}
