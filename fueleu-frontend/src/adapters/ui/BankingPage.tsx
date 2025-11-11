import { useEffect, useState } from "react";
import { api } from "../infrastructure/api";

export default function BankingPage() {
  const [shipId, setShipId] = useState("S1");
  const [year, setYear] = useState(2025);
  const [intensity, setIntensity] = useState(92);
  const [fuelT, setFuelT] = useState(10);
  const [cb, setCb] = useState<number | null>(null);
  const [banked, setBanked] = useState<number | null>(null);
  const [adjusted, setAdjusted] = useState<number | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function compute() {
    setErr(null);
    try {
      const out = await api.computeCB({ shipId, year, intensity, fuelT });
      setCb(out.cb_gco2eq);
      await refreshBalances();
    } catch (e: any) {
      setErr(e.message);
    }
  }

  async function refreshBalances() {
    const adj = await api.adjustedCB(shipId, year);
    setBanked(adj.banked_net);
    setAdjusted(adj.adjusted_cb);
    const rec = await api.listBank(shipId, year);
    setRecords(rec);
  }

  useEffect(() => { refreshBalances(); }, [shipId, year]);

  async function doBank() {
    setErr(null);
    try {
      if (!cb || cb <= 0) throw new Error("Only positive CB can be banked. Compute a positive CB first.");
      await api.bank(shipId, year, cb);
      await refreshBalances();
    } catch (e: any) {
      setErr(e.message);
    }
  }

  async function doApply(amount: number) {
    setErr(null);
    try {
      await api.apply(shipId, year, amount);
      await refreshBalances();
    } catch (e: any) {
      setErr(e.message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="card space-y-3">
          <h3 className="font-semibold">Compute Compliance Balance</h3>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">Ship ID
              <input className="input" value={shipId} onChange={e => setShipId(e.target.value)} />
            </label>
            <label className="text-sm">Year
              <select className="select" value={year} onChange={e => setYear(Number(e.target.value))}>
                <option value={2025}>2025</option>
              </select>
            </label>
            <label className="text-sm">Actual Intensity (g/MJ)
              <input className="input" type="number" value={intensity} onChange={e => setIntensity(Number(e.target.value))} />
            </label>
            <label className="text-sm">Fuel (tonnes)
              <input className="input" type="number" value={fuelT} onChange={e => setFuelT(Number(e.target.value))} />
            </label>
          </div>
          <button className="btn" onClick={compute}>Compute</button>
          {cb !== null && <div className="text-sm">CB (gCO₂e): <b>{cb.toFixed(0)}</b></div>}
          {err && <div className="text-sm text-red-600">{err}</div>}
        </div>

        <div className="card space-y-3">
          <h3 className="font-semibold">Banking</h3>
          <div className="text-sm">Banked Net (≤ year): <b>{banked ?? 0}</b></div>
          <div className="text-sm">Adjusted CB: <b>{adjusted ?? 0}</b></div>
          <div className="flex gap-2">
            <button className="btn" onClick={doBank} disabled={!cb || cb <= 0}>Bank Current CB</button>
            <button className="btn" onClick={() => {
              const amt = Number(prompt("Amount to apply from bank (gCO₂e):") ?? "0");
              if (amt > 0) doApply(amt);
            }}>Apply Banked</button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-2">Bank Ledger</h3>
        <div className="table">
          <table className="w-full">
            <thead>
              <tr>
                <th>ID</th><th>Year</th><th>Amount (gCO₂e)</th><th>Created</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.year}</td>
                  <td>{r.amount_gco2eq}</td>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {records.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-sm text-gray-500">No records</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
