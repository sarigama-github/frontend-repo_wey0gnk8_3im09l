import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.10),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.08),transparent_40%)] pointer-events-none" />
      <div className="relative py-10">
        <Dashboard />
      </div>
    </div>
  );
}

export default App
