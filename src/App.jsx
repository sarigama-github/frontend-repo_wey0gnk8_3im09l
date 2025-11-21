import Dashboard from "./components/Dashboard";

function TopNav() {
  return (
    <div className="sticky top-0 z-40 backdrop-blur bg-slate-900/60 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 shadow-[0_0_0_1px_rgba(148,163,184,0.35)]" />
          <div>
            <div className="text-white font-semibold tracking-tight">Commerce Pulse</div>
            <div className="text-[10px] text-slate-400 -mt-1">Profit Intelligence</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-300 text-sm">
          <button className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700/70 hover:border-slate-600 transition-colors">
            <span>Share</span>
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors">
            <span>New Report</span>
          </button>
          <div className="ml-2 h-8 w-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 border border-slate-700" />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_20%_0%,rgba(59,130,246,0.12),transparent),radial-gradient(600px_300px_at_80%_10%,rgba(168,85,247,0.10),transparent)]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#94a3b8_1px,transparent_1px),linear-gradient(to_bottom,#94a3b8_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <TopNav />

      <div className="relative py-8">
        <Dashboard />
      </div>

      <footer className="relative border-t border-slate-800/80 mt-10">
        <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-slate-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Commerce Pulse</span>
          <span className="hidden sm:inline">Built for modern e‑commerce teams</span>
        </div>
      </footer>
    </div>
  );
}

export default App
