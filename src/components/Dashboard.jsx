import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

function clsx(...cn) {
  return cn.filter(Boolean).join(" ");
}

function Stat({ label, value, sub, trend, trendDir = "up" }) {
  const trendColor = trendDir === "up" ? "text-emerald-400" : trendDir === "down" ? "text-rose-400" : "text-slate-400";
  return (
    <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 backdrop-blur-sm shadow-[0_0_0_1px_rgba(148,163,184,0.05)] hover:shadow-lg hover:border-slate-600 transition-all">
      <div className="flex items-center justify-between">
        <div className="text-slate-300 text-sm">{label}</div>
        {trend !== undefined && (
          <div className={clsx("text-xs font-medium", trendColor)}>
            {trendDir === "up" ? "▲" : trendDir === "down" ? "▼" : "–"} {trend}
          </div>
        )}
      </div>
      <div className="text-white text-3xl font-semibold mt-1 tracking-tight">{value}</div>
      {sub && <div className="text-slate-400 text-xs mt-1">{sub}</div>}
    </div>
  );
}

function Sparkline({ data, color = "#60a5fa" }) {
  const { points } = useMemo(() => {
    if (!data?.length) return { points: "" };
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const w = 260;
    const h = 80;
    const pts = data
      .map((d, i) => {
        const x = (i / (data.length - 1)) * (w - 8) + 4;
        const y = h - ((d.value - min) / range) * (h - 10) - 5;
        return `${x},${y}`;
      })
      .join(" ");
    return { points: pts };
  }, [data]);

  return (
    <svg width="100%" height="90" viewBox="0 0 260 90" preserveAspectRatio="none">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="url(#grad)" stroke="none" points={`${points} 256,85 4,85`} opacity="0.7" />
      <polyline fill="none" stroke={color} strokeWidth="2.5" points={points} />
      <line x1="4" x2="256" y1="85" y2="85" stroke="#334155" strokeWidth="1" />
    </svg>
  );
}

function LineCard({ title, data, color }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 backdrop-blur-sm shadow-[0_0_0_1px_rgba(148,163,184,0.05)] hover:shadow-lg hover:border-slate-600 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="text-slate-200 text-sm font-medium">{title}</div>
      </div>
      <Sparkline data={data} color={color} />
    </div>
  );
}

function Toolbar({ range, setRange, onApply, loading, onSeed, markets, market, setMarket }) {
  return (
    <div className="sticky top-0 z-20 -mx-6 px-6 py-3 mb-4 bg-slate-900/70 backdrop-blur supports-[backdrop-filter]:bg-slate-900/50 border-b border-slate-800">
      <div className="max-w-6xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Profit Dashboard</h1>
          <p className="text-slate-400 text-sm">Revenue, ad spend, COGS, profit/loss, and MRR forecast</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50"
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            disabled={loading}
          >
            <option value="">All markets</option>
            {(markets || []).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input
            type="date"
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50"
            value={range.start}
            onChange={(e) => setRange((r) => ({ ...r, start: e.target.value }))}
          />
          <input
            type="date"
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50"
            value={range.end}
            onChange={(e) => setRange((r) => ({ ...r, end: e.target.value }))}
          />
          <button
            onClick={onApply}
            disabled={loading}
            className={clsx(
              "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
              loading ? "bg-blue-700/60 text-white cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white"
            )}
          >
            {loading ? "Loading…" : "Apply"}
          </button>
          <button
            onClick={onSeed}
            disabled={loading}
            className={clsx(
              "px-4 py-2 rounded-xl text-sm font-medium border border-emerald-500/30 text-emerald-300 hover:text-white hover:bg-emerald-600/30",
              loading && "opacity-60 cursor-not-allowed"
            )}
          >
            Seed Demo Data
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 animate-pulse">
      <div className="h-4 w-28 bg-slate-700/60 rounded mb-3" />
      <div className="h-8 w-40 bg-slate-700/60 rounded" />
    </div>
  );
}

function Toast({ message, type = "error", onClose }) {
  const color = type === "success" ? "bg-emerald-500" : type === "info" ? "bg-blue-500" : "bg-rose-500";
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={clsx("text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3", color)}>
        <span className="text-sm">{message}</span>
        <button className="text-sm/none opacity-80 hover:opacity-100" onClick={onClose}>✕</button>
      </div>
    </div>
  );
}

function KPIItem({ label, targetText, valueText, hit, note, loading }) {
  const dot = hit === true ? "bg-emerald-400" : hit === false ? "bg-rose-400" : "bg-slate-500";
  const badge = hit === true ? "text-emerald-300 border-emerald-500/30" : hit === false ? "text-rose-300 border-rose-500/30" : "text-slate-300 border-slate-500/30";
  return (
    <div className="p-4 rounded-xl border border-slate-700/70 bg-slate-800/40">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={clsx("inline-block h-2 w-2 rounded-full", dot)} />
          <div className="text-slate-200 text-sm font-medium">{label}</div>
        </div>
        <span className={clsx("text-xs px-2 py-0.5 rounded-lg border", badge)}>
          {hit === true ? "On track" : hit === false ? "Flagged" : "Pending"}
        </span>
      </div>
      <div className="text-sm text-slate-300 flex items-center gap-3 flex-wrap">
        <div>Target: <span className="text-slate-200 font-semibold">{targetText}</span></div>
        <div>Current: <span className="text-white font-semibold">{loading ? "…" : valueText}</span></div>
      </div>
      {note && <div className="text-xs text-slate-400 mt-2">{note}</div>}
    </div>
  );
}

function GoldenKPIs({ totals, loading }) {
  const revenue = Number(totals?.revenue || 0);
  const orders = Number(totals?.orders || 0);
  const ad = Number(totals?.ad_spend || 0);
  const cogs = Number(totals?.cogs || 0);
  const fees = Number(totals?.processing_fees || 0);

  const aov = orders > 0 ? revenue / orders : 0;
  const grossMarginPct = revenue > 0 ? ((revenue - cogs) / revenue) * 100 : 0;
  const feePct = revenue > 0 ? (fees / revenue) * 100 : 0;
  const cpa = orders > 0 ? ad / orders : 0;

  const AOV_TARGET = 70; // $
  const GM_TARGET = 80; // %
  const CHURN_TARGET = 70; // % per month (requires subscription data)
  const FEES_TARGET = 5; // % per month
  const CPA_TARGET = 50; // $

  const churnRate = undefined; // Pending until subscription churn calc is wired

  return (
    <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 backdrop-blur-sm shadow-[0_0_0_1px_rgba(148,163,184,0.05)]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-slate-200 text-sm">Golden KPIs</div>
          <div className="text-white text-xl font-semibold tracking-tight">Protect the scale rules</div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <KPIItem
          label="AOV"
          targetText={`$${AOV_TARGET.toFixed(0)}+`}
          valueText={`$${aov.toFixed(2)}`}
          hit={loading ? null : aov >= AOV_TARGET}
          note={aov >= AOV_TARGET ? "Good: average basket size is healthy." : "Action: increase pricing, bundles, or AOV offers."}
          loading={loading}
        />
        <KPIItem
          label="Gross Margin (Supplier)"
          targetText={`${GM_TARGET}%+`}
          valueText={`${grossMarginPct.toFixed(1)}%`}
          hit={loading ? null : grossMarginPct >= GM_TARGET}
          note={grossMarginPct >= GM_TARGET ? "Good: product margin supports scale." : "Action: renegotiate COGS, adjust pricing, or reduce discounts."}
          loading={loading}
        />
        <KPIItem
          label="Churn Rate (Monthly)"
          targetText={`${CHURN_TARGET}% or less`}
          valueText={churnRate === undefined ? "Not available" : `${churnRate.toFixed(1)}%`}
          hit={churnRate === undefined ? null : churnRate <= CHURN_TARGET}
          note={
            churnRate === undefined
              ? "Connect subscription events to compute churn."
              : churnRate <= CHURN_TARGET
              ? "Good: retention within guardrails."
              : "Action: improve onboarding, activation, and win-back."
          }
          loading={loading}
        />
        <KPIItem
          label="Processing Fees"
          targetText={`≤ ${FEES_TARGET}%`}
          valueText={`${feePct.toFixed(2)}%`}
          hit={loading ? null : feePct <= FEES_TARGET}
          note={feePct <= FEES_TARGET ? "Good: fees in control." : "Action: optimize gateway rates or payment mix."}
          loading={loading}
        />
        <KPIItem
          label="CPA (Facebook)"
          targetText={`≤ $${CPA_TARGET}`}
          valueText={`$${cpa.toFixed(2)}`}
          hit={loading ? null : cpa <= CPA_TARGET}
          note={cpa <= CPA_TARGET ? "Good: acquisition cost efficient." : "Action: improve creatives, audiences, or funnel CVR."}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [range, setRange] = useState({ start: "", end: "" });
  const [market, setMarket] = useState("");
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadMarkets = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/markets`);
      if (res.ok) {
        const data = await res.json();
        setMarkets(data || []);
      }
    } catch (e) {
      // ignore
    }
  };

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams();
      if (range.start) qs.set("start", range.start);
      if (range.end) qs.set("end", range.end);
      if (market) qs.set("market", market);
      const res = await fetch(`${API_BASE}/api/daily-summary?${qs.toString()}`);
      if (!res.ok) throw new Error("Failed to load daily summary");
      const data = await res.json();
      setSummary(data);
      const fq = new URLSearchParams();
      fq.set("days_ahead", "60");
      if (market) fq.set("market", market);
      const f = await fetch(`${API_BASE}/api/mrr-forecast?${fq.toString()}`);
      if (!f.ok) throw new Error("Failed to load forecast");
      setForecast(await f.json());
      setLastUpdated(new Date());
    } catch (e) {
      console.error(e);
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/seed-demo`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      if (!res.ok) throw new Error("Seeding failed");
      setToast({ type: "success", message: "Demo data generated successfully." });
      await load();
      await loadMarkets();
    } catch (e) {
      console.error(e);
      setToast({ type: "error", message: e.message || "Failed to seed demo data." });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  useEffect(() => {
    loadMarkets();
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [market]);

  const dayToPoint = (days, key) => (days || []).map((d) => ({ label: d.date, value: Number(d[key] || 0) }));
  const totals = summary?.totals || {};

  const hasData = (summary?.days || []).length > 0;

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Toolbar
        range={range}
        setRange={setRange}
        onApply={load}
        loading={loading}
        onSeed={handleSeed}
        markets={markets}
        market={market}
        setMarket={setMarket}
      />

      {!hasData && !loading ? (
        <div className="mt-10">
          <div className="rounded-2xl border border-slate-700/70 bg-slate-800/40 p-10 text-center">
            <div className="text-2xl font-semibold text-white mb-2">No data yet</div>
            <p className="text-slate-400 mb-6">Seed demo data or connect your sources to see metrics populate in real-time.</p>
            <div className="flex justify-center gap-3">
              <button onClick={handleSeed} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm">Seed Demo Data</button>
              <button onClick={load} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm">Refresh</button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <Stat label={`Revenue (${market || 'All'})`} value={`$${(totals.revenue || 0).toFixed(2)}`} />
            <Stat label={`Ad Spend (${market || 'All'})`} value={`$${(totals.ad_spend || 0).toFixed(2)}`} />
            <Stat label={`COGS (${market || 'All'})`} value={`$${(totals.cogs || 0).toFixed(2)}`} />
            <Stat label={`Profit (${market || 'All'})`} value={`$${(totals.profit || 0).toFixed(2)}`} trend={totals.revenue ? `${Math.round(((totals.profit || 0) / (totals.revenue || 1)) * 100)}% margin` : undefined} trendDir={(totals.profit || 0) >= 0 ? "up" : "down"} />
          </>
        )}
      </div>

      <div className="mb-6">
        <GoldenKPIs totals={totals} loading={loading} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <LineCard title={`Daily Revenue (${market || 'All'})`} data={dayToPoint(summary?.days, "revenue")} color="#22d3ee" />
            <LineCard title={`Daily Ad Spend (${market || 'All'})`} data={dayToPoint(summary?.days, "ad_spend")} color="#f472b6" />
            <LineCard title={`Daily COGS (${market || 'All'})`} data={dayToPoint(summary?.days, "cogs")} color="#f59e0b" />
            <LineCard title={`Daily Profit (${market || 'All'})`} data={dayToPoint(summary?.days, "profit")} color="#4ade80" />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 backdrop-blur-sm shadow-[0_0_0_1px_rgba(148,163,184,0.05)]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-slate-200 text-sm">MRR Forecast</div>
                <div className="text-white text-2xl font-semibold tracking-tight">
                  Today: ${forecast?.today_mrr?.toFixed(2) || 0}
                </div>
                <div className="text-slate-400 text-xs">Avg Daily Net New: ${forecast?.daily_net_new_avg?.toFixed(2) || 0}</div>
              </div>
              <button onClick={load} className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm">
                Refresh
              </button>
            </div>
            {loading ? (
              <SkeletonCard />
            ) : (
              <Sparkline
                data={(forecast?.forecast || []).map((d) => ({ label: d.date, value: d.mrr }))}
                color="#a78bfa"
              />
            )}
            {lastUpdated && (
              <div className="text-right text-xs text-slate-500 mt-2">Last updated {lastUpdated.toLocaleTimeString()}</div>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5">
            <div className="text-slate-200 text-sm mb-2">Quick Tips</div>
            <ul className="text-slate-400 text-sm space-y-2 list-disc pl-5">
              <li>Use the market selector to compare performance by region.</li>
              <li>Use the date filters in the header to narrow your analysis.</li>
              <li>Seed demo data to explore the experience instantly.</li>
              <li>Forecast shows a simple 60-day projection from recent trend.</li>
            </ul>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5">
            <div className="text-slate-200 text-sm mb-2">System Status</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">Backend</span>
              <span className="text-slate-500">{API_BASE || "configured"}</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-rose-700/50 bg-rose-950/50 text-rose-200 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
