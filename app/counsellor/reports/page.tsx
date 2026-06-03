"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/layout/topbar";

interface ReportSection {
  key: string; label: string; enabled: boolean;
}

const SECTIONS: ReportSection[] = [
  { key: "outcomes", label: "Application outcomes (accepted, rejected, waitlisted)", enabled: true },
  { key: "exam_distributions", label: "Exam score distributions by band", enabled: true },
  { key: "avg_scores", label: "Average scores across school", enabled: true },
  { key: "sessions", label: "Session activity", enabled: false },
  { key: "scholarships", label: "Scholarship amounts awarded", enabled: true },
  { key: "popular_unis", label: "Most popular universities", enabled: false },
  { key: "essay_rates", label: "Essay completion rates", enabled: false },
  { key: "deadlines", label: "Deadline compliance", enabled: false },
];

interface ReportData {
  outcomes: { status: string; count: number }[];
  scholarshipTotal: number;
  totalStudents: number;
  exams: { name: string; avg: string; count: number }[];
  popularUnis: { name: string; count: number }[];
}

export default function CounsellorReportsPage() {
  const [sections, setSections] = useState(SECTIONS);
  const [graduatingYear, setGraduatingYear] = useState("2026");
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  function toggleSection(key: string) {
    setSections(sections.map(s => s.key === key ? { ...s, enabled: !s.enabled } : s));
  }

  async function generateReport() {
    setGenerating(true);
    const supabase = createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: profile } = await supabase.from("profiles").select("school_id").eq("id", user.id).single();
    if (!profile?.school_id) return;

    // Outcomes
    const { data: apps } = await supabase.from("applications").select("status");
    const outcomeMap = new Map<string, number>();
    for (const a of (apps ?? [])) { outcomeMap.set(a.status, (outcomeMap.get(a.status) ?? 0) + 1); }
    const outcomes = Array.from(outcomeMap.entries()).map(([status, count]) => ({ status, count }));

    // Students
    const { count: totalStudents } = await supabase.from("profiles").select("id", { count: "exact", head: true }).eq("school_id", profile.school_id).eq("role", "student");

    // Scholarships
    const { data: awards } = await supabase.from("scholarship_awards").select("total_amount");
    const scholarshipTotal = (awards ?? []).reduce((sum: number, a: any) => sum + (a.total_amount ?? 0), 0);

    // Exams
    const { data: exams } = await supabase.from("student_exams").select("exam_name, score").eq("status", "taken").not("score", "is", null);
    const examGroups = new Map<string, number[]>();
    for (const e of (exams ?? [])) {
      const name = e.exam_name;
      if (!examGroups.has(name)) examGroups.set(name, []);
      const score = parseFloat(e.score);
      if (!isNaN(score)) examGroups.get(name)!.push(score);
    }
    const examStats = Array.from(examGroups.entries()).map(([name, scores]) => ({
      name, avg: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1), count: scores.length,
    }));

    // Popular universities
    const { data: bookmarks } = await supabase.from("university_bookmarks").select("university_id, universities(name)");
    const uniCounts = new Map<string, { name: string; count: number }>();
    for (const b of (bookmarks ?? [])) {
      const name = (b as any).universities?.name ?? "Unknown";
      const existing = uniCounts.get(b.university_id);
      uniCounts.set(b.university_id, { name, count: (existing?.count ?? 0) + 1 });
    }
    const popularUnis = Array.from(uniCounts.values()).sort((a, b) => b.count - a.count).slice(0, 10);

    setReportData({ outcomes, scholarshipTotal, totalStudents: totalStudents ?? 0, exams: examStats, popularUnis });
    setGenerating(false);
  }

  const STATUS_LABELS: Record<string, string> = { considering: "Considering", active: "Active", submitted: "Submitted", accepted: "Accepted", rejected: "Rejected", waitlisted: "Waitlisted", enrolled: "Enrolled" };
  const STATUS_COLORS: Record<string, string> = { considering: "#94a3b8", active: "#B7770D", submitted: "#2563EB", accepted: "#1A7F6E", rejected: "#C0392B", waitlisted: "#6D28D9", enrolled: "#C9933A" };
  const inputClass = "px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy bg-white outline-none focus:border-navy transition-colors";

  return (
    <>
      <Topbar title="Reports" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl">
          {/* Builder */}
          <div className="bg-white border border-cream-mid rounded-card p-6 mb-6">
            <h3 className="font-serif text-lg text-navy mb-1">Report builder</h3>
            <p className="text-xs text-slate-400 mb-4">Select which sections to include in your report.</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {sections.map(s => (
                <label key={s.key} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${s.enabled ? "border-gold bg-gold/5" : "border-cream-mid"}`}>
                  <input type="checkbox" checked={s.enabled} onChange={() => toggleSection(s.key)} className="accent-gold" />
                  <span className="text-sm text-navy">{s.label}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <select value={graduatingYear} onChange={e => setGraduatingYear(e.target.value)} className={inputClass}>
                <option value="2026">Class of 2026</option><option value="2027">Class of 2027</option><option value="all">All years</option>
              </select>
              <button onClick={generateReport} disabled={generating} className="px-6 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-mid transition-colors disabled:opacity-50">
                {generating ? "Generating…" : "Generate report"}
              </button>
            </div>
          </div>

          {/* Report output */}
          {reportData && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-cream-mid rounded-card p-4 text-center">
                  <div className="font-serif text-2xl text-navy">{reportData.totalStudents}</div>
                  <div className="text-xs text-slate-400">Total students</div>
                </div>
                <div className="bg-white border border-cream-mid rounded-card p-4 text-center">
                  <div className="font-serif text-2xl text-status-green">{reportData.outcomes.find(o => o.status === "accepted")?.count ?? 0}</div>
                  <div className="text-xs text-slate-400">Acceptances</div>
                </div>
                <div className="bg-white border border-cream-mid rounded-card p-4 text-center">
                  <div className="font-serif text-2xl text-gold">${reportData.scholarshipTotal.toLocaleString()}</div>
                  <div className="text-xs text-slate-400">Total scholarships</div>
                </div>
              </div>

              {/* Outcomes */}
              {sections.find(s => s.key === "outcomes")?.enabled && reportData.outcomes.length > 0 && (
                <div className="bg-white border border-cream-mid rounded-card p-6">
                  <h4 className="font-serif text-base text-navy mb-4">Application outcomes</h4>
                  <div className="flex gap-3 flex-wrap">
                    {reportData.outcomes.map(o => (
                      <div key={o.status} className="flex items-center gap-2 px-3 py-2 bg-cream rounded-lg">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[o.status] ?? "#94a3b8" }} />
                        <span className="text-sm text-navy font-medium">{o.count}</span>
                        <span className="text-xs text-slate-400">{STATUS_LABELS[o.status] ?? o.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exams */}
              {sections.find(s => s.key === "exam_distributions")?.enabled && reportData.exams.length > 0 && (
                <div className="bg-white border border-cream-mid rounded-card p-6">
                  <h4 className="font-serif text-base text-navy mb-4">Exam statistics</h4>
                  <div className="space-y-2">
                    {reportData.exams.map(e => (
                      <div key={e.name} className="flex items-center gap-3 px-3 py-2.5 bg-cream rounded-lg">
                        <span className="text-sm font-medium text-navy flex-1">{e.name}</span>
                        <span className="text-sm text-navy font-semibold">{e.avg}</span>
                        <span className="text-xs text-slate-400">avg ({e.count} students)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular universities */}
              {sections.find(s => s.key === "popular_unis")?.enabled && reportData.popularUnis.length > 0 && (
                <div className="bg-white border border-cream-mid rounded-card p-6">
                  <h4 className="font-serif text-base text-navy mb-4">Most popular universities</h4>
                  <div className="space-y-2">
                    {reportData.popularUnis.map((u, i) => (
                      <div key={i} className="flex items-center gap-3 px-3 py-2 bg-cream rounded-lg">
                        <span className="text-xs font-semibold text-slate-400 w-5">{i + 1}</span>
                        <span className="text-sm font-medium text-navy flex-1">{u.name}</span>
                        <span className="text-xs text-slate-400">{u.count} student{u.count !== 1 ? "s" : ""}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
