import { useEffect, useMemo, useState } from "react";
import { api } from "../infrastructure/api";
import type { Route } from "../../core/ports";

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filters, setFilters] = useState({ year: "2025" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listRoutes();
      setRoutes(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return routes.filter(r => (filters.year ? String(r.year) === filters.year : true));
  }, [routes, filters.year]);

  async function setBaseline(id: number) {
    try {
      await api.setBaseline(id);
      await load();
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div>
          <label className="text-xs block mb-1">Year</label>
          <select className="select" value={filters.year} onChange={e => setFilters({ ...filters, year: e.target.value })}>
            <option>2025</option>
          </select>
        </div>
        <button className="btn" onClick={load} disabled={loading}>Refresh</button>
        {error && <span className="text-red-600 text-sm">{error}</span>}
      </div>

      <div className="table">
        <table className="w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Route</th>
              <th>Year</th>
              <th>GHG Intensity (gCO₂e/MJ)</th>
              <th>Baseline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.route_id}</td>
                <td>{r.year}</td>
                <td>{r.ghg_intensity.toFixed(3)}</td>
                <td>{r.is_baseline ? "✅" : "—"}</td>
                <td>
                  <button className="btn" disabled={r.is_baseline} onClick={() => setBaseline(r.id)}>
                    Set Baseline
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr><td colSpan={6} className="p-4 text-center text-sm text-gray-500">No routes</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
