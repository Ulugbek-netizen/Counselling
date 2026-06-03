"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/layout/topbar";

export default function CounsellorScholarshipsPage() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient() as any;
      const { data } = await supabase.from("scholarships").select("*").order("name");
      setScholarships(data ?? []);
    }
    load();
  }, []);

  const filtered = scholarships.filter((s: any) => !search || s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Topbar title="Scholarships" />
      <div className="flex-1 overflow-y-auto p-6">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="w-full max-w-md px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy bg-white mb-4 outline-none focus:border-navy" placeholder="Search scholarships…" />
        <div className="bg-white border border-cream-mid rounded-card overflow-hidden">
          {filtered.map((s: any) => (
            <div key={s.id} className="flex items-center gap-3 px-4 py-3 border-b border-cream-mid last:border-b-0">
              <div className="flex-1"><div className="text-sm font-medium text-navy">{s.name}</div><div className="text-xs text-slate-400">{s.eligibility ?? "—"}</div></div>
              {s.amount && <span className="text-xs text-navy font-medium">{s.amount_currency ?? "USD"} {s.amount.toLocaleString()}</span>}
              {s.deadline && <span className="text-xs text-slate-400">{s.deadline}</span>}
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-8 text-sm text-slate-300">No scholarships</div>}
        </div>
      </div>
    </>
  );
}
