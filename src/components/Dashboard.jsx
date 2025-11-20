import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

function Stat({ label, value, sub }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
      <div className="text-slate-300 text-sm">{label}</div>
      <div className="text-white text-2xl font-semibold mt-1">{value}</div>
      {sub && <div className="text-slate-400 text-xs mt-1">{sub}</div>}
    </div>
  );
}

function Line({ title, data, color = "#60a5fa" }) {
  // very small inline line chart using svg
  const points = useMemo(() => {
    if (!data?.length) return "";
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const w = 240;
    const h = 60;
    return data
      .map((d, i) => {
        const x = (i / (data.length - 1)) * (w - 8) + 4;
        const y = h - ((d.value - min) / range) * (h - 8) - 4;
        return `${x},${y}`;
      })
      .join(" ");
  }, [data]);

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
      <div className="text-slate-200 text-sm mb-2">{title}</div>
      <svg width="100%" height="70" viewBox="0 0 240 70" preserveAspectRatio="none">
        <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
      </svg>
    </div>
  );
}

export default function Dashboard() {
  const [range, setRange] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [forecast, setForecast] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (range.start) qs.set("start", range.start);
      if (range.end) qs.set("end", range.end);
      const res = await fetch(`${API_BASE}/api/daily-summary?${qs.toString()}`);
      const data = await res.json();
      setSummary(data);
      const f = await fetch(`${API_BASE}/api/mrr-forecast?days_ahead=60`);
      setForecast(await f.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dayToPoint = (days, key) =>
    (days || []).map((d) => ({ label: d.date, value: Number(d[key] || 0) }));

  const totals = summary?.totals || {};

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Profit Dashboard</h1>
        <p className="text-slate-300 mt-2">
          Daily revenue, ad spend, COGS, profit/loss, and MRR forecast
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Revenue (range)" value={`$${(totals.revenue || 0).toFixed(2)}`} />
        <Stat label="Ad Spend (range)" value={`$${(totals.ad_spend || 0).toFixed(2)}`} />
        <Stat label="COGS (range)" value={`$${(totals.cogs || 0).toFixed(2)}`} />
        <Stat label="Profit (range)" value={`$${(totals.profit || 0).toFixed(2)}`} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Line title="Daily Revenue" data={dayToPoint(summary?.days, "revenue")} color="#22d3ee" />
        <Line title="Daily Ad Spend" data={dayToPoint(summary?.days, "ad_spend")} color="#f472b6" />
        <Line title="Daily COGS" data={dayToPoint(summary?.days, "cogs")} color="#f59e0b" />
        <Line title="Daily Profit" data={dayToPoint(summary?.days, "profit")} color="#4ade80" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-slate-200 text-sm">MRR Forecast</div>
                <div className="text-white text-xl font-semibold">
                  Today: ${forecast?.today_mrr?.toFixed(2) || 0}
                </div>
                <div className="text-slate-400 text-xs">Avg Daily Net New: ${forecast?.daily_net_new_avg?.toFixed(2) || 0}</div>
              </div>
              <button onClick={load} className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm">
                Refresh
              </button>
            </div>
            <Line
              title="Next 60 days"
              data={(forecast?.forecast || []).map((d) => ({ label: d.date, value: d.mrr }))}
              color="#a78bfa"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
            <div className="text-slate-200 text-sm mb-2">Quick Actions</div>
            <button
              onClick={async () => {
                await fetch(`${API_BASE}/api/seed-demo`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
                load();
              }}
              className="w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm"
            >
              Seed Demo Data
            </button>
            <div className="text-slate-400 text-xs mt-2">
              Generates sample orders, ad spend and subscription events for the last 30 days.
            </div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
            <div className="text-slate-200 text-sm mb-2">Date Range</div>
            <div className="space-y-2">
              <input
                type="date"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                value={range.start}
                onChange={(e) => setRange((r) => ({ ...r, start: e.target.value }))}
              />
              <input
                type="date"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                value={range.end}
                onChange={(e) => setRange((r) => ({ ...r, end: e.target.value }))}
              />
              <button onClick={load} className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
