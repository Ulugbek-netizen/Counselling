import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import type { UserRole } from "@/types/database";

export default async function UniversityProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const s = supabase as any;
  const { data: uni } = await s.from("universities").select("*").eq("id", id).single();
  if (!uni) notFound();

  const [programs, requirements, deadlines, pathways, features] = await Promise.all([
    s.from("university_programs").select("*").eq("university_id", id).order("name"),
    s.from("university_requirements").select("*").eq("university_id", id),
    s.from("university_deadlines").select("*").eq("university_id", id).order("deadline_date"),
    s.from("university_pathways").select("*").eq("university_id", id),
    s.from("university_features").select("*").eq("university_id", id),
  ]);

  // Student's exams for comparison
  const { data: studentExams } = await s.from("student_exams").select("exam_name, score").eq("student_id", user.id).eq("status", "taken");
  const examMap = new Map<string, string>((studentExams ?? []).map((e: any) => [e.exam_name.toLowerCase(), e.score]));

  const FLAG_MAP: Record<string, string> = { US:"🇺🇸",UK:"🇬🇧",CA:"🇨🇦",AU:"🇦🇺",SG:"🇸🇬",CH:"🇨🇭",DE:"🇩🇪",FR:"🇫🇷",JP:"🇯🇵",KR:"🇰🇷",NL:"🇳🇱" };
  const flag = FLAG_MAP[uni.country] ?? "🏫";
  const todayStr = new Date().toISOString().split("T")[0];

  const typeLabels: Record<string, string> = { ea:"Early Action", ed:"Early Decision", ed2:"Early Decision II", rea:"REA", rd:"Regular Decision", rolling:"Rolling", other:"Other" };

  return (
    <>
      <Topbar title={uni.name} subtitle={`${uni.city}, ${uni.country}`} />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl">
          {/* Header card */}
          <div className="bg-white border border-cream-mid rounded-card p-6 mb-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-cream flex items-center justify-center text-2xl flex-shrink-0">{flag}</div>
              <div className="flex-1">
                <h2 className="font-serif text-2xl text-navy">{uni.name}</h2>
                <p className="text-sm text-slate-400">{uni.city}, {uni.country} · {uni.type ?? "University"}</p>
                {uni.tagline && <p className="text-sm text-slate-500 mt-1">{uni.tagline}</p>}
              </div>
              {uni.website && (
                <a href={uni.website} target="_blank" rel="noreferrer" className="px-3 py-1.5 border border-cream-mid rounded-lg text-xs text-slate-500 hover:bg-cream transition-colors flex-shrink-0">
                  Visit website ↗
                </a>
              )}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {uni.tuition_international && (
                <div className="bg-cream rounded-lg p-3 text-center">
                  <div className="font-serif text-lg text-navy">{uni.tuition_currency ?? "USD"} {Math.round(uni.tuition_international / 1000)}k</div>
                  <div className="text-[0.68rem] text-slate-400">Tuition/year (intl.)</div>
                </div>
              )}
              {uni.acceptance_rate_international !== null && (
                <div className="bg-cream rounded-lg p-3 text-center">
                  <div className="font-serif text-lg text-navy">{uni.acceptance_rate_international}%</div>
                  <div className="text-[0.68rem] text-slate-400">Acceptance rate (intl.)</div>
                </div>
              )}
              <div className="bg-cream rounded-lg p-3 text-center">
                <div className="font-serif text-lg text-navy">{programs.data?.length ?? 0}</div>
                <div className="text-[0.68rem] text-slate-400">Programs (English)</div>
              </div>
              <div className="bg-cream rounded-lg p-3 text-center">
                <div className="font-serif text-lg text-navy">{deadlines.data?.filter((d: any) => d.deadline_date >= todayStr).length ?? 0}</div>
                <div className="text-[0.68rem] text-slate-400">Open deadlines</div>
              </div>
            </div>
            {uni.description && <p className="text-sm text-slate-500 mt-4 leading-relaxed">{uni.description}</p>}
          </div>

          {/* Programs */}
          <div className="bg-white border border-cream-mid rounded-card p-6 mb-4">
            <h3 className="font-serif text-lg text-navy mb-4">Programs</h3>
            {(programs.data ?? []).length > 0 ? (
              <div className="space-y-2">
                {(programs.data ?? []).map((p: any) => (
                  <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 bg-cream rounded-lg">
                    <div className="flex-1"><span className="text-sm font-medium text-navy">{p.name}</span>{p.school_faculty && <span className="text-xs text-slate-400 ml-2">· {p.school_faculty}</span>}</div>
                    {p.duration_years && <span className="text-xs text-slate-400">{p.duration_years} yrs ({p.duration_semesters ?? p.duration_years * 2} sem)</span>}
                    {p.is_double_degree && <span className="bg-purple-50 text-status-purple text-[0.62rem] font-medium px-1.5 py-0.5 rounded-full">Double degree</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-slate-300 text-center py-4">No programs listed</p>}
          </div>

          {/* Requirements */}
          <div className="bg-white border border-cream-mid rounded-card p-6 mb-4">
            <h3 className="font-serif text-lg text-navy mb-4">Requirements</h3>
            {(requirements.data ?? []).length > 0 ? (
              <div className="space-y-2">
                {(requirements.data ?? []).map((r: any) => {
                  const studentScore = examMap.get(r.exam_name.toLowerCase());
                  const meets = studentScore && r.minimum_score ? parseFloat(studentScore) >= parseFloat(r.minimum_score) : null;
                  return (
                    <div key={r.id} className="flex items-center gap-3 px-3 py-2.5 bg-cream rounded-lg">
                      <span className="text-sm font-medium text-navy flex-1">{r.exam_name}</span>
                      <span className="text-xs text-slate-400">Min: {r.minimum_score ?? "—"}</span>
                      {r.average_admitted_score && <span className="text-xs text-slate-400">Avg: {r.average_admitted_score}</span>}
                      {meets !== null && (
                        <span className={`text-[0.65rem] font-medium px-2 py-0.5 rounded-full ${meets ? "bg-emerald-50 text-status-green" : "bg-amber-50 text-status-amber"}`}>
                          {meets ? `✓ You: ${studentScore}` : `⚠ You: ${studentScore}`}
                        </span>
                      )}
                      {meets === null && studentScore === undefined && <span className="text-[0.65rem] text-slate-300">No score</span>}
                    </div>
                  );
                })}
              </div>
            ) : <p className="text-sm text-slate-300 text-center py-4">No requirements listed</p>}
          </div>

          {/* Deadlines */}
          <div className="bg-white border border-cream-mid rounded-card p-6 mb-4">
            <h3 className="font-serif text-lg text-navy mb-4">Deadlines</h3>
            {(deadlines.data ?? []).length > 0 ? (
              <div className="space-y-2">
                {(deadlines.data ?? []).map((d: any) => {
                  const days = Math.ceil((new Date(d.deadline_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  const past = days < 0;
                  const urgency = past ? "text-slate-400" : days <= 7 ? "text-status-red" : days <= 30 ? "text-status-amber" : "text-status-green";
                  return (
                    <div key={d.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${past ? "bg-gray-50" : "bg-cream"}`}>
                      <span className="text-sm font-medium text-navy flex-1">{typeLabels[d.application_type] ?? d.application_type}</span>
                      <span className="text-xs text-slate-400">{d.deadline_date}</span>
                      <span className={`text-[0.7rem] font-semibold ${urgency}`}>{past ? "Passed" : `${days}d left`}</span>
                      {d.decision_date && <span className="text-xs text-slate-400">Decision: {d.decision_date}</span>}
                    </div>
                  );
                })}
              </div>
            ) : <p className="text-sm text-slate-300 text-center py-4">No deadlines listed</p>}
          </div>

          {/* Application pathways */}
          <div className="bg-white border border-cream-mid rounded-card p-6 mb-4">
            <h3 className="font-serif text-lg text-navy mb-4">Application pathways</h3>
            {(pathways.data ?? []).length > 0 ? (
              <div className="space-y-2">
                {(pathways.data ?? []).map((p: any) => (
                  <div key={p.id} className="px-4 py-3 bg-cream rounded-lg">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-medium text-navy">{p.platform_name}</span>
                      {p.url && <a href={p.url} target="_blank" rel="noreferrer" className="text-xs text-status-blue hover:underline">Apply ↗</a>}
                      {p.fee && <span className="text-xs text-slate-400">{p.fee_currency ?? "USD"} {p.fee}</span>}
                      {p.fee_waiver_available && <span className="bg-emerald-50 text-status-green text-[0.62rem] font-medium px-1.5 py-0.5 rounded-full">Fee waiver</span>}
                    </div>
                    {p.admin_tips && <p className="text-xs text-slate-500 italic">💡 {p.admin_tips}</p>}
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-slate-300 text-center py-4">No pathways listed</p>}
          </div>

          {/* Special features */}
          {(features.data ?? []).length > 0 && (
            <div className="bg-white border border-cream-mid rounded-card p-6 mb-4">
              <h3 className="font-serif text-lg text-navy mb-4">Special features</h3>
              <div className="space-y-2">
                {(features.data ?? []).map((f: any) => (
                  <div key={f.id} className="px-3 py-2.5 bg-cream rounded-lg">
                    <span className="text-sm font-medium text-navy">{f.title}</span>
                    {f.description && <p className="text-xs text-slate-400 mt-0.5">{f.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
