"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/layout/topbar";

interface ScholarshipRow { id: string; name: string; amount: number | null; currency: string; eligibility: string | null; deadline: string | null; daysLeft: number | null; isBookmarked: boolean; recommendedBy: string | null; }

export default function StudentScholarshipsPage() {
  const [scholarships, setScholarships] = useState<ScholarshipRow[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => { load(); }, []);
  async function load() {
    const supabase = createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: all } = await supabase.from("scholarships").select("*").order("deadline");
    const { data: bookmarks } = await supabase.from("scholarship_bookmarks").select("scholarship_id, recommended_by, is_approved").eq("student_id", user.id);
    const bmMap = new Map<string, any>((bookmarks ?? []).map((b: any) => [b.scholarship_id, b]));

    setScholarships((all ?? []).map((s: any) => {
      const daysLeft = s.deadline ? Math.ceil((new Date(s.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
      const bm = bmMap.get(s.id);
      return { id: s.id, name: s.name, amount: s.amount, currency: s.amount_currency ?? "USD", eligibility: s.eligibility, deadline: s.deadline, daysLeft, isBookmarked: !!bm, recommendedBy: bm?.recommended_by ?? null };
    }));
  }

  async function toggleBookmark(id: string) {
    const supabase = createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const s = scholarships.find(x => x.id === id);
    if (!s) return;
    if (s.isBookmarked) { await supabase.from("scholarship_bookmarks").delete().eq("student_id", user.id).eq("scholarship_id", id); }
    else { await supabase.from("scholarship_bookmarks").insert({ student_id: user.id, scholarship_id: id, is_approved: true }); }
    setScholarships(scholarships.map(x => x.id === id ? { ...x, isBookmarked: !x.isBookmarked } : x));
  }

  const filtered = scholarships.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Topbar title="Scholarships" />
      <div className="flex-1 overflow-y-auto p-6">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="w-full max-w-md px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy bg-white mb-4 outline-none focus:border-navy" placeholder="Search scholarships…" />
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(s => (
            <div key={s.id} className="bg-white border border-cream-mid rounded-card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-2.5 mb-2">
                <div className="flex-1">
                  <div className="text-sm font-medium text-navy">{s.name}</div>
                  {s.amount && <div className="text-xs text-slate-400">{s.currency} {s.amount.toLocaleString()}</div>}
                </div>
                <button onClick={() => toggleBookmark(s.id)} className={`w-7 h-7 rounded-md border flex items-center justify-center text-sm flex-shrink-0 transition-colors ${s.isBookmarked ? "bg-amber-50 border-amber-200 text-status-amber" : "border-cream-mid text-slate-400 hover:bg-cream"}`}>★</button>
              </div>
              {s.eligibility && <p className="text-xs text-slate-400 mb-2 line-clamp-2">{s.eligibility}</p>}
              <div className="flex items-center gap-2">
                {s.deadline && s.daysLeft !== null && (
                  <span className={`text-[0.62rem] font-medium px-1.5 py-0.5 rounded-full ${s.daysLeft <= 7 ? "bg-red-50 text-status-red" : s.daysLeft <= 30 ? "bg-amber-50 text-status-amber" : "bg-emerald-50 text-status-green"}`}>{s.daysLeft}d left</span>
                )}
                {s.recommendedBy && <span className="bg-gold/10 text-gold text-[0.62rem] font-medium px-1.5 py-0.5 rounded-full">★ Recommended</span>}
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-sm text-slate-300">No scholarships found</div>}
      </div>
    </>
  );
}
