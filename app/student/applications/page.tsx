"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/layout/topbar";

interface AppRow { id: string; universityName: string; applicationType: string; deadlineDate: string | null; daysLeft: number | null; status: string; progressPercent: number; }
const TYPE_LABELS: Record<string, string> = { ea:"EA", ed:"ED", ed2:"ED2", rea:"REA", rd:"RD", rolling:"Rolling", other:"Other" };
const STATUS_STYLES: Record<string, string> = {
  considering:"bg-gray-100 text-slate-500", active:"bg-amber-50 text-status-amber", submitted:"bg-blue-50 text-status-blue",
  accepted:"bg-emerald-50 text-status-green", rejected:"bg-red-50 text-status-red", waitlisted:"bg-purple-50 text-status-purple", enrolled:"bg-gold/10 text-gold",
};

export default function StudentApplicationsPage() {
  const [apps, setApps] = useState<AppRow[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient() as any;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("applications").select("id, application_type, status, deadline_date, progress_percent, university_id, universities!applications_university_id_fkey(name)").eq("student_id", user.id).order("deadline_date");
      setApps((data ?? []).map((a: any) => {
        const daysLeft = a.deadline_date ? Math.ceil((new Date(a.deadline_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
        return { id: a.id, universityName: a.universities?.name ?? "University", applicationType: a.application_type ?? "rd", deadlineDate: a.deadline_date, daysLeft, status: a.status, progressPercent: a.progress_percent ?? 0 };
      }));
    }
    load();
  }, []);

  return (
    <>
      <Topbar title="My Applications" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white border border-cream-mid rounded-card overflow-hidden">
          <div className="grid grid-cols-[2fr_70px_100px_70px_90px_80px] px-4 py-2.5 border-b border-cream-mid bg-cream gap-2">
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">University</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Type</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Deadline</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Days</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Status</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Progress</div>
          </div>
          {apps.map(a => (
            <div key={a.id} className="grid grid-cols-[2fr_70px_100px_70px_90px_80px] px-4 py-3 border-b border-cream-mid last:border-b-0 items-center gap-2 hover:bg-cream/50 cursor-pointer">
              <div className="text-sm font-medium text-navy">{a.universityName}</div>
              <span className="text-[0.65rem] font-medium px-1.5 py-0.5 rounded-full bg-cream text-slate-500 w-fit">{TYPE_LABELS[a.applicationType] ?? a.applicationType}</span>
              <div className="text-xs text-slate-400">{a.deadlineDate ?? "—"}</div>
              <div>{a.daysLeft !== null && a.daysLeft >= 0 ? <span className={`text-[0.65rem] font-medium px-1.5 py-0.5 rounded-full ${a.daysLeft <= 7 ? "bg-red-50 text-status-red" : a.daysLeft <= 30 ? "bg-amber-50 text-status-amber" : "bg-emerald-50 text-status-green"}`}>{a.daysLeft}d</span> : <span className="text-xs text-slate-300">—</span>}</div>
              <span className={`text-[0.65rem] font-medium px-1.5 py-0.5 rounded-full w-fit ${STATUS_STYLES[a.status] ?? ""}`}>{a.status}</span>
              <div className="w-full h-[5px] bg-cream-mid rounded-full overflow-hidden"><div className="h-full rounded-full bg-navy" style={{ width: `${a.progressPercent}%` }} /></div>
            </div>
          ))}
          {apps.length === 0 && <div className="text-center py-8 text-sm text-slate-300">No applications yet. Browse universities to get started.</div>}
        </div>
      </div>
    </>
  );
}
