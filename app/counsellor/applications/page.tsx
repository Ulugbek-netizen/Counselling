"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/layout/topbar";

interface AppRow {
  id: string; studentName: string; studentInitials: string; studentGrade: string;
  universityName: string; universityCountry: string; universityId: string;
  applicationType: string; deadlineDate: string | null; daysLeft: number | null;
  status: string; progressPercent: number;
}

const TYPE_LABELS: Record<string, string> = { ea:"EA", ed:"ED", ed2:"ED2", rea:"REA", rd:"RD", rolling:"Rolling", other:"Other" };
const STATUS_STYLES: Record<string, string> = {
  considering:"bg-gray-100 text-slate-500", active:"bg-amber-50 text-status-amber", submitted:"bg-blue-50 text-status-blue",
  accepted:"bg-emerald-50 text-status-green", rejected:"bg-red-50 text-status-red", waitlisted:"bg-purple-50 text-status-purple", enrolled:"bg-gold/10 text-gold",
};

export default function CounsellorApplicationsPage() {
  const [apps, setApps] = useState<AppRow[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [view, setView] = useState<"table" | "university">("table");
  const [expandedUni, setExpandedUni] = useState<Set<string>>(new Set());

  useEffect(() => { loadApps(); }, []);

  async function loadApps() {
    const supabase = createClient() as any;
    const { data } = await supabase.from("applications")
      .select("id, application_type, status, deadline_date, progress_percent, student_id, university_id, profiles!applications_student_id_fkey(first_name, last_name, grade), universities!applications_university_id_fkey(name, country)")
      .order("deadline_date", { ascending: true });

    setApps((data ?? []).map((a: any) => {
      const daysLeft = a.deadline_date ? Math.ceil((new Date(a.deadline_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
      return {
        id: a.id, studentName: a.profiles ? `${a.profiles.first_name} ${a.profiles.last_name}` : "Student",
        studentInitials: a.profiles ? `${a.profiles.first_name?.[0] ?? ""}${a.profiles.last_name?.[0] ?? ""}` : "?",
        studentGrade: a.profiles?.grade ?? "—", universityName: a.universities?.name ?? "University",
        universityCountry: a.universities?.country ?? "", universityId: a.university_id,
        applicationType: a.application_type ?? "rd", deadlineDate: a.deadline_date, daysLeft,
        status: a.status, progressPercent: a.progress_percent ?? 0,
      };
    }));
  }

  const filtered = apps.filter(a => {
    const q = search.toLowerCase();
    const matchesSearch = !q || a.studentName.toLowerCase().includes(q) || a.universityName.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Group by university for accordion
  const grouped = new Map<string, { name: string; country: string; apps: AppRow[] }>();
  for (const a of filtered) {
    if (!grouped.has(a.universityId)) grouped.set(a.universityId, { name: a.universityName, country: a.universityCountry, apps: [] });
    grouped.get(a.universityId)!.apps.push(a);
  }

  function toggleUni(id: string) {
    const next = new Set(expandedUni);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedUni(next);
  }

  const FLAG_MAP: Record<string, string> = { US:"🇺🇸",UK:"🇬🇧",CA:"🇨🇦",AU:"🇦🇺",DE:"🇩🇪",FR:"🇫🇷",JP:"🇯🇵",KR:"🇰🇷",NL:"🇳🇱",CH:"🇨🇭" };
  const inputClass = "px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy bg-white outline-none focus:border-navy transition-colors";
  const dlStyle = (d: number) => d <= 7 ? "bg-red-50 text-status-red" : d <= 30 ? "bg-amber-50 text-status-amber" : "bg-emerald-50 text-status-green";

  return (
    <>
      <Topbar title="Applications" actions={
        <div className="flex gap-1 bg-cream-mid rounded-lg p-0.5">
          <button onClick={() => setView("table")} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === "table" ? "bg-white text-navy shadow-sm" : "text-slate-400"}`}>By application</button>
          <button onClick={() => setView("university")} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === "university" ? "bg-white text-navy shadow-sm" : "text-slate-400"}`}>By university</button>
        </div>
      } />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} className={inputClass + " flex-1 min-w-[200px]"} placeholder="Search…" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={inputClass}>
            <option value="">All statuses</option>
            {["considering","active","submitted","accepted","rejected","waitlisted","enrolled"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="text-xs text-slate-400">{filtered.length} applications</span>
        </div>

        {view === "table" ? (
          <div className="bg-white border border-cream-mid rounded-card overflow-hidden">
            <div className="grid grid-cols-[2fr_2fr_60px_90px_70px_90px_80px] px-4 py-2.5 border-b border-cream-mid bg-cream gap-2">
              <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Student</div>
              <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">University</div>
              <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Type</div>
              <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Deadline</div>
              <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Days</div>
              <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Status</div>
              <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Progress</div>
            </div>
            {filtered.map(a => (
              <div key={a.id} className="grid grid-cols-[2fr_2fr_60px_90px_70px_90px_80px] px-4 py-3 border-b border-cream-mid last:border-b-0 items-center gap-2 hover:bg-cream/50 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center text-[0.6rem] font-semibold text-white flex-shrink-0">{a.studentInitials}</div>
                  <div><div className="text-sm font-medium text-navy">{a.studentName}</div><div className="text-[0.65rem] text-slate-400">Grade {a.studentGrade}</div></div>
                </div>
                <div className="text-sm text-slate-500 truncate">{a.universityName}</div>
                <span className="text-[0.65rem] font-medium px-1.5 py-0.5 rounded-full bg-cream text-slate-500">{TYPE_LABELS[a.applicationType] ?? a.applicationType}</span>
                <div className="text-xs text-slate-400">{a.deadlineDate ?? "—"}</div>
                <div>{a.daysLeft !== null && a.daysLeft >= 0 ? <span className={`text-[0.65rem] font-medium px-1.5 py-0.5 rounded-full ${dlStyle(a.daysLeft)}`}>{a.daysLeft}d</span> : <span className="text-xs text-slate-300">—</span>}</div>
                <span className={`text-[0.65rem] font-medium px-1.5 py-0.5 rounded-full ${STATUS_STYLES[a.status] ?? ""}`}>{a.status}</span>
                <div className="w-full h-[5px] bg-cream-mid rounded-full overflow-hidden"><div className="h-full rounded-full bg-navy" style={{ width: `${a.progressPercent}%` }} /></div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-center py-8 text-sm text-slate-300">No applications found</div>}
          </div>
        ) : (
          <div className="space-y-3">
            {Array.from(grouped.entries()).map(([uniId, group]) => {
              const isOpen = expandedUni.has(uniId);
              const applied = group.apps.filter(a => ["submitted", "accepted", "enrolled"].includes(a.status)).length;
              const planning = group.apps.filter(a => ["considering", "active"].includes(a.status)).length;
              return (
                <div key={uniId} className="bg-white border border-cream-mid rounded-card overflow-hidden">
                  <div onClick={() => toggleUni(uniId)} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-cream/50 transition-colors">
                    <span className="text-lg">{FLAG_MAP[group.country] ?? "🏫"}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-navy">{group.name}</div>
                      <div className="text-xs text-slate-400">{group.country}</div>
                    </div>
                    <div className="flex gap-2">
                      {applied > 0 && <span className="bg-blue-50 text-status-blue text-[0.62rem] font-medium px-2 py-0.5 rounded-full">{applied} applied</span>}
                      {planning > 0 && <span className="bg-gray-100 text-slate-500 text-[0.62rem] font-medium px-2 py-0.5 rounded-full">{planning} planning</span>}
                      <span className="bg-cream text-slate-500 text-[0.62rem] font-medium px-2 py-0.5 rounded-full">{group.apps.length} total</span>
                    </div>
                    <span className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
                  </div>
                  {isOpen && (
                    <div className="border-t border-cream-mid">
                      {group.apps.map(a => (
                        <div key={a.id} className="grid grid-cols-[2fr_60px_90px_70px_90px_80px] px-4 py-2.5 border-b border-cream-mid last:border-b-0 items-center gap-2 pl-12">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-navy/80 flex items-center justify-center text-[0.55rem] font-semibold text-white">{a.studentInitials}</div>
                            <div className="text-sm text-navy">{a.studentName}</div>
                          </div>
                          <span className="text-[0.62rem] font-medium px-1.5 py-0.5 rounded-full bg-cream text-slate-500">{TYPE_LABELS[a.applicationType] ?? a.applicationType}</span>
                          <div className="text-xs text-slate-400">{a.deadlineDate ?? "—"}</div>
                          <div>{a.daysLeft !== null && a.daysLeft >= 0 ? <span className={`text-[0.62rem] font-medium px-1.5 py-0.5 rounded-full ${dlStyle(a.daysLeft)}`}>{a.daysLeft}d</span> : "—"}</div>
                          <span className={`text-[0.62rem] font-medium px-1.5 py-0.5 rounded-full ${STATUS_STYLES[a.status] ?? ""}`}>{a.status}</span>
                          <div className="w-full h-[5px] bg-cream-mid rounded-full overflow-hidden"><div className="h-full rounded-full bg-navy" style={{ width: `${a.progressPercent}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {grouped.size === 0 && <div className="text-center py-12 text-sm text-slate-300">No applications found</div>}
          </div>
        )}
      </div>
    </>
  );
}
