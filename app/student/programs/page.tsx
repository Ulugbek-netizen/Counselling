"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/layout/topbar";

interface ProgramRow { id: string; name: string; type: string | null; hostInstitution: string | null; location: string | null; country: string | null; price: number | null; isFree: boolean; deadline: string | null; daysLeft: number | null; isBookmarked: boolean; }

export default function StudentProgramsPage() {
  const [programs, setPrograms] = useState<ProgramRow[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => { loadPrograms(); }, []);

  async function loadPrograms() {
    const supabase = createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: all } = await supabase.from("programs").select("*").order("deadline", { ascending: true });
    const { data: bookmarks } = await supabase.from("program_bookmarks").select("program_id").eq("student_id", user.id);
    const bookmarkedIds = new Set((bookmarks ?? []).map((b: any) => b.program_id));

    setPrograms((all ?? []).map((p: any) => {
      const daysLeft = p.deadline ? Math.ceil((new Date(p.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
      return {
        id: p.id, name: p.name, type: p.type, hostInstitution: p.host_institution,
        location: p.location, country: p.country, price: p.price, isFree: p.is_free,
        deadline: p.deadline, daysLeft, isBookmarked: bookmarkedIds.has(p.id),
      };
    }));
  }

  async function toggleBookmark(id: string) {
    const supabase = createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const prog = programs.find(p => p.id === id);
    if (!prog) return;

    if (prog.isBookmarked) {
      await supabase.from("program_bookmarks").delete().eq("student_id", user.id).eq("program_id", id);
    } else {
      await supabase.from("program_bookmarks").insert({ student_id: user.id, program_id: id });
    }
    setPrograms(programs.map(p => p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p));
  }

  const filtered = programs.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.hostInstitution ?? "").toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Topbar title="Programs & Olympiads" />
      <div className="flex-1 overflow-y-auto p-6">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="w-full max-w-md px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy bg-white mb-4 outline-none focus:border-navy" placeholder="Search programs…" />
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(p => (
            <div key={p.id} className="bg-white border border-cream-mid rounded-card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-2.5 mb-2">
                <div className="flex-1">
                  <div className="text-sm font-medium text-navy">{p.name}</div>
                  <div className="text-xs text-slate-400">{p.hostInstitution ?? ""} {p.location ? `· ${p.location}` : ""}</div>
                </div>
                <button onClick={() => toggleBookmark(p.id)} className={`w-7 h-7 rounded-md border flex items-center justify-center text-sm flex-shrink-0 transition-colors ${p.isBookmarked ? "bg-amber-50 border-amber-200 text-status-amber" : "border-cream-mid text-slate-400 hover:bg-cream"}`}>★</button>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {p.type && <span className="bg-purple-50 text-status-purple text-[0.62rem] font-medium px-1.5 py-0.5 rounded-full">{p.type}</span>}
                {p.isFree ? <span className="bg-emerald-50 text-status-green text-[0.62rem] font-medium px-1.5 py-0.5 rounded-full">Free</span> : p.price && <span className="bg-gray-100 text-slate-500 text-[0.62rem] font-medium px-1.5 py-0.5 rounded-full">${p.price}</span>}
                {p.country && <span className="bg-gray-100 text-slate-500 text-[0.62rem] font-medium px-1.5 py-0.5 rounded-full">{p.country}</span>}
              </div>
              {p.deadline && p.daysLeft !== null && (
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span>Deadline: {p.deadline}</span>
                  <span className={`font-medium px-1.5 py-0.5 rounded-full text-[0.62rem] ${p.daysLeft <= 7 ? "bg-red-50 text-status-red" : p.daysLeft <= 30 ? "bg-amber-50 text-status-amber" : "bg-emerald-50 text-status-green"}`}>{p.daysLeft}d</span>
                </div>
              )}
            </div>
          ))}
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-sm text-slate-300">{search ? "No programs match" : "No programs in the database yet"}</div>}
      </div>
    </>
  );
}
