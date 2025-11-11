export interface Route {
  id: number;
  route_id: string;
  year: number;
  ghg_intensity: number; // gCO2e/MJ
  is_baseline: boolean;
}

export interface ShipCompliance {
  id: number;
  ship_id: string;
  year: number;
  cb_gco2eq: number;
  created_at: Date;
}

export interface BankEntry {
  id: number;
  ship_id: string;
  year: number;
  amount_gco2eq: number;
  created_at: Date;
}

export interface Pool {
  id: number;
  year: number;
  created_at: Date;
  members: PoolMember[];
}

export interface PoolMember {
  id: number;
  pool_id: number;
  ship_id: string;
  cb_before: number;
  cb_after: number;
}
