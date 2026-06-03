"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/layout/topbar";

interface ProgramRow { id: string; name: string; type: string | null; hostInstitution: string | null; deadline: string | null; studentBookmarks: number; }

export default function CounsellorProgramsPage() {
  const [programs, setPrograms] = useState<ProgramRow[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient() as any;
      const { data: all } = await supabase.from("programs").select("id, name, type, host_institution, deadline").order("name");
      const { data: bookmarks } = await supabase.from("program_bookmarks").select("program_id");
      const countMap = new Map<string, number>();
      for (const b of (bookmarks ?? [])) { countMap.set(b.program_id, (countMap.get(b.program_id) ?? 0) + 1); }
      setPrograms((all ?? []).map((p: any) => ({ id: p.id, name: p.name, type: p.type, hostInstitution: p.host_institution, deadline: p.deadline, studentBookmarks: countMap.get(p.id) ?? 0 })));
    }
    load();
  }, []);

  const filtered = programs.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Topbar title="Programs & Olympiads" />
      <div className="flex-1 overflow-y-auto p-6">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="w-full max-w-md px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy bg-white mb-4 outline-none focus:border-navy" placeholder="Search programs…" />
        <div className="bg-white border border-cream-mid rounded-card overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] px-4 py-2.5 border-b border-cream-mid bg-cream">
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Program</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Type</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Host</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Deadline</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Students</div>
          </div>
          {filtered.map(p => (
            <div key={p.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] px-4 py-3 border-b border-cream-mid last:border-b-0 items-center hover:bg-cream/50">
              <div className="text-sm font-medium text-navy">{p.name}</div>
              <span className="text-xs text-slate-400">{p.type ?? "—"}</span>
              <span className="text-xs text-slate-400 truncate">{p.hostInstitution ?? "—"}</span>
              <span className="text-xs text-slate-400">{p.deadline ?? "—"}</span>
              <span className="text-xs text-navy font-medium">{p.studentBookmarks > 0 ? p.studentBookmarks : "—"}</span>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-8 text-sm text-slate-300">No programs</div>}
        </div>
      </div>
    </>
  );
}
