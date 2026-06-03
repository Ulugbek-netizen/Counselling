"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/layout/topbar";

interface DocRow { id: string; studentName: string; category: string; customLabel: string | null; fileName: string; fileSize: number | null; createdAt: string; }

const CAT_LABELS: Record<string, string> = {
  transcript: "Transcript", recommendation_letter: "Recommendation", personal_statement: "Personal Statement",
  cv_resume: "CV/Resume", test_score_report: "Test Score", financial_document: "Financial", other: "Other",
};

export default function CounsellorDocumentsPage() {
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => { loadDocs(); }, []);

  async function loadDocs() {
    const supabase = createClient() as any;
    const { data } = await supabase.from("documents").select("id, category, custom_label, file_name, file_size, created_at, student_id, profiles!documents_student_id_fkey(first_name, last_name)").order("created_at", { ascending: false });
    setDocs((data ?? []).map((d: any) => ({
      id: d.id, studentName: d.profiles ? `${d.profiles.first_name} ${d.profiles.last_name}` : "Student",
      category: d.category, customLabel: d.custom_label, fileName: d.file_name, fileSize: d.file_size, createdAt: d.created_at,
    })));
  }

  const filtered = docs.filter(d => {
    const q = search.toLowerCase();
    return !q || d.studentName.toLowerCase().includes(q) || d.fileName.toLowerCase().includes(q) || (CAT_LABELS[d.category] ?? "").toLowerCase().includes(q);
  });

  return (
    <>
      <Topbar title="Documents" />
      <div className="flex-1 overflow-y-auto p-6">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="w-full max-w-md px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy bg-white mb-4 outline-none focus:border-navy" placeholder="Search by student, filename, or category…" />
        <div className="bg-white border border-cream-mid rounded-card overflow-hidden">
          <div className="grid grid-cols-[1.5fr_1fr_2fr_80px_1fr] px-4 py-2.5 border-b border-cream-mid bg-cream">
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Student</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Category</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">File</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Size</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Uploaded</div>
          </div>
          {filtered.map(d => (
            <div key={d.id} className="grid grid-cols-[1.5fr_1fr_2fr_80px_1fr] px-4 py-3 border-b border-cream-mid last:border-b-0 items-center hover:bg-cream/50 cursor-pointer">
              <div className="text-sm text-navy">{d.studentName}</div>
              <span className="text-[0.65rem] font-medium px-1.5 py-0.5 rounded-full bg-cream text-slate-500 w-fit">{d.customLabel ? `Other: ${d.customLabel}` : CAT_LABELS[d.category] ?? d.category}</span>
              <div className="text-xs text-slate-500 truncate">{d.fileName}</div>
              <div className="text-xs text-slate-400">{d.fileSize ? `${Math.round(d.fileSize / 1024)}KB` : "—"}</div>
              <div className="text-xs text-slate-400">{new Date(d.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-8 text-sm text-slate-300">No documents uploaded yet</div>}
        </div>
      </div>
    </>
  );
}
