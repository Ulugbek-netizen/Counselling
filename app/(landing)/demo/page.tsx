import Link from "next/link";

const DEMO_STUDENTS = [
  { name: "Aisha D.", grade: "11", unis: "MIT, Stanford", status: "On track", progress: 72 },
  { name: "Bataa G.", grade: "12", unis: "Oxford, UCL, ETH Zurich", status: "Priority", progress: 45 },
  { name: "Chingun M.", grade: "11", unis: "University of Tokyo", status: "Active", progress: 30 },
  { name: "Dulguun T.", grade: "12", unis: "KAIST, NUS, HKU", status: "On track", progress: 88 },
];

const DEMO_DEADLINES = [
  { uni: "MIT", student: "Aisha D.", days: 3, type: "EA" },
  { uni: "Oxford", student: "Bataa G.", days: 12, type: "RD" },
  { uni: "Stanford", student: "Aisha D.", days: 28, type: "REA" },
];

const DEMO_EVENTS = [
  { label: "MIT deadline — 3 days", color: "#C0392B" },
  { label: "Bataa session — tomorrow", color: "#C9933A" },
  { label: "IELTS exam — Friday", color: "#6D28D9" },
  { label: "🎂 Chingun birthday — Saturday", color: "#1A7F6E" },
];

const STATUS_STYLES: Record<string, string> = { "On track": "bg-emerald-50 text-status-green", Priority: "bg-red-50 text-status-red", Active: "bg-amber-50 text-status-amber" };

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Demo banner */}
      <div className="bg-gold text-white text-center py-2 text-sm font-medium">
        📋 This is an interactive demo with sample data. <Link href="/#get-started" className="underline ml-1">Ready to start? →</Link>
      </div>

      <div className="flex h-[calc(100vh-36px)]">
        {/* Sidebar */}
        <aside className="w-[220px] flex-shrink-0 bg-navy flex flex-col">
          <div className="px-5 pt-5 pb-3 border-b border-white/[0.07]">
            <div className="font-serif text-lg text-white">Edu<span className="text-gold">Path</span></div>
            <div className="text-[0.68rem] text-white/30 mt-0.5">Demo — Counsellor Portal</div>
          </div>
          <nav className="flex-1 py-3 px-3">
            {[
              { label: "Dashboard", icon: "⊞", active: true },
              { label: "My Students", icon: "👥" },
              { label: "Applications", icon: "📋" },
              { label: "Essays", icon: "✍️" },
              { label: "Sessions", icon: "📅" },
              { label: "Universities", icon: "🎓" },
              { label: "Chat", icon: "💬" },
              { label: "Reports", icon: "📊" },
            ].map(l => (
              <div key={l.label} className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[0.82rem] mb-px ${l.active ? "bg-white/10 text-white font-medium" : "text-white/50"}`}>
                {l.active && <div className="absolute left-0 w-[3px] h-[18px] bg-gold rounded-r" />}
                <span className="text-sm w-[18px] text-center">{l.icon}</span>{l.label}
              </div>
            ))}
          </nav>
          <div className="px-3 py-3 border-t border-white/[0.07]">
            <div className="text-sm text-white font-medium">Demo Counsellor</div>
            <div className="text-[0.68rem] text-white/35">Sample School</div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <div className="h-[54px] bg-white border-b border-cream-mid flex items-center justify-between px-7">
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-lg text-navy">Dashboard</h1>
              <span className="text-xs text-slate-400">· Sample data</span>
            </div>
          </div>

          {/* Notification banner */}
          <div className="bg-navy px-7 py-2.5 flex items-center gap-4 overflow-x-auto">
            <div className="text-[0.7rem] font-semibold tracking-widest uppercase text-gold whitespace-nowrap">This week</div>
            <div className="flex gap-2">
              {DEMO_EVENTS.map((e, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-white/[0.07] border border-white/10 text-white/80 text-xs px-3 py-1 rounded-full whitespace-nowrap">
                  <span className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: e.color }} />{e.label}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total students", value: "24" },
                { label: "Active applications", value: "87", color: "#C0392B" },
                { label: "Priority students", value: "3", color: "#C9933A" },
                { label: "Deadlines this month", value: "11", color: "#2E4F8A" },
              ].map(s => (
                <div key={s.label} className="bg-white border border-cream-mid rounded-card p-4">
                  <div className="text-xs text-slate-400">{s.label}</div>
                  <div className="font-serif text-3xl tracking-tight" style={{ color: s.color ?? "#0E1E3D" }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-4" style={{ gridTemplateColumns: "2fr 1fr 300px" }}>
              {/* Students */}
              <div className="bg-white border border-cream-mid rounded-card overflow-hidden">
                <div className="px-4 py-3 border-b border-cream-mid font-serif text-sm text-navy">My Students</div>
                {DEMO_STUDENTS.map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-4 py-3 border-b border-cream-mid last:border-b-0">
                    <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-[0.65rem] font-semibold text-white">{s.name.split(" ").map(w => w[0]).join("")}</div>
                    <div className="flex-1"><div className="text-sm font-medium text-navy">{s.name}</div><div className="text-xs text-slate-400">Grade {s.grade} · {s.unis}</div></div>
                    <span className={`text-[0.62rem] font-medium px-1.5 py-0.5 rounded-full ${STATUS_STYLES[s.status] ?? ""}`}>{s.status}</span>
                    <div className="w-16 h-[5px] bg-cream-mid rounded-full overflow-hidden"><div className="h-full rounded-full bg-navy" style={{ width: `${s.progress}%` }} /></div>
                  </div>
                ))}
              </div>

              {/* Deadlines */}
              <div className="bg-white border border-cream-mid rounded-card overflow-hidden">
                <div className="px-4 py-3 border-b border-cream-mid font-serif text-sm text-navy">Urgent deadlines</div>
                {DEMO_DEADLINES.map((d, i) => (
                  <div key={i} className="flex items-start gap-2.5 px-4 py-2.5 border-b border-cream-mid last:border-b-0">
                    <div className="w-[3px] rounded self-stretch" style={{ backgroundColor: d.days <= 7 ? "#C0392B" : d.days <= 30 ? "#B7770D" : "#1A7F6E" }} />
                    <div className="flex-1"><div className="text-[0.8rem] font-medium text-navy">{d.uni}</div><div className="text-[0.7rem] text-slate-400">{d.student} · {d.type}</div></div>
                    <span className={`text-[0.7rem] font-semibold px-2 py-0.5 rounded-full ${d.days <= 7 ? "bg-red-50 text-status-red" : "bg-amber-50 text-status-amber"}`}>{d.days} days</span>
                  </div>
                ))}
              </div>

              {/* Calendar placeholder */}
              <div className="bg-white border border-cream-mid rounded-card p-4">
                <div className="font-serif text-sm text-navy mb-3">June 2026</div>
                <div className="grid grid-cols-7 gap-px text-center text-[0.6rem] text-slate-400 mb-2">
                  {["Mo","Tu","We","Th","Fr","Sa","Su"].map(d => <div key={d} className="py-0.5 font-semibold">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-px text-center">
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(d => (
                    <div key={d} className={`aspect-square flex items-center justify-center text-xs rounded-md ${d === 3 ? "bg-navy text-white font-semibold" : d === 5 ? "text-status-red font-medium" : "text-slate-500"}`}>
                      {d}
                      {[5, 12, 18].includes(d) && <span className="absolute bottom-[2px] w-1 h-1 rounded-full bg-status-red" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
