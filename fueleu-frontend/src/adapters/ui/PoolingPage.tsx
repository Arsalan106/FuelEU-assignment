import { useState } from "react";
import { api } from "../infrastructure/api";

type Member = { ship_id: string; cb_before: number; fetched?: boolean };

export default function PoolingPage() {
  const [year, setYear] = useState(2025);
  const [members, setMembers] = useState<Member[]>([
    { ship_id: "A", cb_before: 0 },
    { ship_id: "B", cb_before: 0 }
  ]);
  const [pool, setPool] = useState<any | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function updateMember(i: number, patch: Partial<Member>) {
    setMembers(m => m.map((mm, idx) => idx === i ? { ...mm, ...patch } : mm));
  }
  function addMember() {
    setMembers(m => [...m, { ship_id: "", cb_before: 0 }]);
  }
  function removeMember(i: number) {
    setMembers(m => m.filter((_, idx) => idx !== i));
  }

  async function fetchAdjusted(i: number) {
    setErr(null);
    try {
      const m = members[i];
      const res = await api.adjustedCB(m.ship_id, year);
      updateMember(i, { cb_before: res.adjusted_cb, fetched: true });
    } catch (e: any) {
      setErr(e.message);
    }
  }

  async function createPool() {
    setErr(null);
    setPool(null);
    try {
      const sum = members.reduce((a, m) => a + (m.cb_before || 0), 0);
      if (sum < 0) throw new Error("Sum of CBs must be non-negative.");
      const payload = members.map(m => ({ ship_id: m.ship_id, cb_before: Number(m.cb_before) }));
      const p = await api.createPool(year, payload);
      setPool(p);
    } catch (e: any) {
      setErr(e.message);
    }
  }

  const sum = members.reduce((a, m) => a + (Number(m.cb_before) || 0), 0);

  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <h3 className="font-semibold">Pool Members</h3>
        <div className="flex items-end gap-3">
          <label className="text-sm">Year
            <select className="select" value={year} onChange={e => setYear(Number(e.target.value))}>
              <option value={2025}>2025</option>
            </select>
          </label>
          <button className="btn" onClick={addMember}>Add Member</button>
          <div className={`text-sm px-2 py-1 rounded ${sum >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            Pool Sum: <b>{sum}</b>
          </div>
        </div>

        <div className="table">
          <table className="w-full">
            <thead>
              <tr>
                <th>#</th><th>Ship ID</th><th>CB Before (gCO₂e)</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={i}>
                  <td>{i+1}</td>
                  <td>
                    <input className="input" value={m.ship_id} onChange={e => updateMember(i, { ship_id: e.target.value })} />
                  </td>
                  <td>
                    <input className="input" type="number" value={m.cb_before} onChange={e => updateMember(i, { cb_before: Number(e.target.value) })} />
                  </td>
                  <td className="space-x-2">
                    <button className="btn" onClick={() => fetchAdjusted(i)}>Fetch Adjusted</button>
                    <button className="btn" onClick={() => removeMember(i)}>Remove</button>
                  </td>
                </tr>
              ))}
              {members.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-sm text-gray-500">No members</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="flex gap-2">
          <button className="btn" onClick={createPool} disabled={sum < 0}>Create Pool</button>
          {err && <div className="text-sm text-red-600">{err}</div>}
        </div>
      </div>

      {pool && (
        <div className="card">
          <h3 className="font-semibold mb-2">Pool Result</h3>
          <div className="table">
            <table className="w-full">
              <thead>
                <tr><th>Ship</th><th>CB Before</th><th>CB After</th></tr>
              </thead>
              <tbody>
                {pool.members?.map((m: any, i: number) => (
                  <tr key={i}>
                    <td>{m.ship_id}</td>
                    <td>{m.cb_before}</td>
                    <td>{m.cb_after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
