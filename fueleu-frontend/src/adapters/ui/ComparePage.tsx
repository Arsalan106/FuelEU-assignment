import { useEffect, useState } from "react";
import { api } from "../infrastructure/api";
import type { ComparisonRow } from "../../core/ports";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ComparePage() {
  const [year, setYear] = useState(2025);
  const [rows, setRows] = useState<ComparisonRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.comparison(year);
      setRows(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, [year]);

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div>
          <label className="text-xs block mb-1">Year</label>
          <select className="select" value={year} onChange={e => setYear(Number(e.target.value))}>
            <option value={2025}>2025</option>
          </select>
        </div>
        <button className="btn" onClick={load} disabled={loading}>Refresh</button>
        {error && <span className="text-red-600 text-sm">{error}</span>}
      </div>

      <div className="table">
        <table className="w-full">
          <thead>
            <tr>
              <th>Route</th>
              <th>GHG Intensity</th>
              <th>% Diff (vs Baseline)</th>
              <th>Compliant</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>{r.route_id}{r.is_baseline ? " (baseline)" : ""}</td>
                <td>{r.ghg_intensity.toFixed(3)}</td>
                <td>{r.percentDiff === null ? "—" : r.percentDiff.toFixed(2) + "%"}</td>
                <td>{r.compliant === null ? "—" : r.compliant ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-2">GHG Intensity by Route</h3>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={rows.map(r => ({ name: r.route_id, value: r.ghg_intensity }))}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
