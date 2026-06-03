"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UniversityCard } from "@/components/universities/university-card";
import { createClient } from "@/lib/supabase/client";

interface UniData {
  id: string; name: string; country: string; city: string; tagline: string | null;
  tuition: number | null; tuitionCurrency: string; acceptanceRate: number | null;
  matchScore: number | null; matchLabel: "reach" | "target" | "safety" | null;
  topMajors: string[]; totalPrograms: number; applicationTypes: string[];
  nextDeadline: { days: number; label: string } | null; isBookmarked: boolean;
}

interface Props {
  universities: UniData[];
  defaultCountry: string;
  defaultMajor: string;
}

export function UniversityBrowser({ universities: initial, defaultCountry }: Props) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState(defaultCountry);
  const [sort, setSort] = useState("match");
  const [unis, setUnis] = useState(initial);
  const router = useRouter();

  const inputClass = "px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy bg-white outline-none focus:border-navy transition-colors";
  const countries = [...new Set(initial.map(u => u.country))].sort();

  const filtered = unis
    .filter(u => {
      const q = search.toLowerCase();
      const matchesSearch = !q || u.name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q) || u.topMajors.some(m => m.toLowerCase().includes(q));
      const matchesCountry = !country || u.country === country;
      return matchesSearch && matchesCountry;
    })
    .sort((a, b) => {
      if (sort === "match") return (b.matchScore ?? 0) - (a.matchScore ?? 0);
      if (sort === "deadline") return (a.nextDeadline?.days ?? 999) - (b.nextDeadline?.days ?? 999);
      if (sort === "tuition") return (a.tuition ?? 999999) - (b.tuition ?? 999999);
      return a.name.localeCompare(b.name);
    });

  const recommended = filtered.filter(u => u.matchScore !== null && u.matchScore >= 70);

  async function handleBookmark(id: string) {
    const supabase = createClient() as any;
    const uni = unis.find(u => u.id === id);
    if (!uni) return;

    if (uni.isBookmarked) {
      await supabase.from("university_bookmarks").delete().eq("university_id", id);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("university_bookmarks").insert({ student_id: user?.id, university_id: id, status: "considering" });
    }
    setUnis(unis.map(u => u.id === id ? { ...u, isBookmarked: !u.isBookmarked } : u));
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} className={inputClass + " flex-1 min-w-[200px]"} placeholder="Search universities…" />
        <select value={country} onChange={e => setCountry(e.target.value)} className={inputClass + " min-w-[140px]"}>
          <option value="">All countries</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} className={inputClass + " min-w-[150px]"}>
          <option value="match">Sort: best match</option>
          <option value="deadline">Sort: deadline</option>
          <option value="tuition">Sort: tuition low→high</option>
          <option value="name">Sort: A→Z</option>
        </select>
      </div>

      {recommended.length > 0 && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-lg">
          <span className="text-xs font-medium text-status-green">★ Recommended for you</span>
          <span className="text-[0.7rem] text-status-green/60">— based on your preferences and scores</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {filtered.map(u => (
          <UniversityCard key={u.id} {...u} onBookmark={handleBookmark} onClick={(id) => router.push(`/student/universities/${id}`)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-sm text-slate-300">
          {search || country ? "No universities match your filters" : "No universities in the database yet"}
        </div>
      )}
    </>
  );
}
