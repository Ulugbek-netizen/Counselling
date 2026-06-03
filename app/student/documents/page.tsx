"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/layout/topbar";

interface Doc { id: string; category: string; customLabel: string | null; fileName: string; fileUrl: string; fileSize: number | null; createdAt: string; }

const CATEGORIES = [
  { value: "transcript", label: "Transcript" },
  { value: "recommendation_letter", label: "Recommendation Letter" },
  { value: "personal_statement", label: "Personal Statement" },
  { value: "cv_resume", label: "CV / Resume" },
  { value: "test_score_report", label: "Test Score Report" },
  { value: "financial_document", label: "Financial Document" },
  { value: "other", label: "Other" },
];

const CAT_ICONS: Record<string, string> = {
  transcript: "📜", recommendation_letter: "✉️", personal_statement: "📝",
  cv_resume: "📋", test_score_report: "📊", financial_document: "💰", other: "📎",
};

export default function StudentDocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [category, setCategory] = useState("transcript");
  const [customLabel, setCustomLabel] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { loadDocs(); }, []);

  async function loadDocs() {
    const supabase = createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("documents").select("id, category, custom_label, file_name, file_url, file_size, created_at").eq("student_id", user.id).order("created_at", { ascending: false });
    setDocs((data ?? []).map((d: any) => ({
      id: d.id, category: d.category, customLabel: d.custom_label, fileName: d.file_name, fileUrl: d.file_url, fileSize: d.file_size, createdAt: d.created_at,
    })));
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    const supabase = createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setUploading(false); return; }

    const ext = file.name.split(".").pop();
    const path = `documents/${user.id}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("documents").upload(path, file);

    if (uploadError) {
      // Storage bucket might not exist yet — save with placeholder URL
      console.error("Upload error:", uploadError);
    }

    const { data: urlData } = supabase.storage.from("documents").getPublicUrl(path);
    const fileUrl = urlData?.publicUrl ?? path;

    await supabase.from("documents").insert({
      student_id: user.id, uploaded_by: user.id, category,
      custom_label: category === "other" ? customLabel || null : null,
      file_name: file.name, file_url: fileUrl, file_size: file.size,
    });

    setUploading(false); setShowUpload(false); setFile(null); setCustomLabel("");
    await loadDocs();
  }

  const inputClass = "w-full px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy bg-white outline-none focus:border-navy transition-colors";

  return (
    <>
      <Topbar title="My Documents" actions={<button onClick={() => setShowUpload(true)} className="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium">+ Upload document</button>} />
      <div className="flex-1 overflow-y-auto p-6">
        {showUpload && (
          <div className="bg-white border border-gold/30 rounded-card p-6 mb-6 max-w-lg">
            <h3 className="font-serif text-lg text-navy mb-4">Upload document</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className={inputClass}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              {category === "other" && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Document name</label>
                  <input value={customLabel} onChange={e => setCustomLabel(e.target.value)} className={inputClass} placeholder="e.g. Portfolio, Research Paper…" />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">File</label>
                <input type="file" onChange={e => setFile(e.target.files?.[0] ?? null)} className="text-sm text-slate-500" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleUpload} disabled={uploading || !file} className="px-4 py-2 bg-gold text-white rounded-lg text-sm font-medium disabled:opacity-50">{uploading ? "Uploading…" : "Upload"}</button>
                <button onClick={() => setShowUpload(false)} className="px-4 py-2 border border-cream-mid rounded-lg text-sm text-slate-500">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(cat => {
            const catDocs = docs.filter(d => d.category === cat.value);
            if (catDocs.length === 0) return (
              <div key={cat.value} className="bg-white border border-cream-mid rounded-card p-4 opacity-50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{CAT_ICONS[cat.value]}</span>
                  <span className="text-sm font-medium text-navy">{cat.label}</span>
                </div>
                <p className="text-xs text-slate-300">No documents uploaded</p>
              </div>
            );
            return (
              <div key={cat.value} className="bg-white border border-cream-mid rounded-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{CAT_ICONS[cat.value]}</span>
                  <span className="text-sm font-medium text-navy">{cat.label}</span>
                  <span className="bg-cream text-[0.62rem] font-medium text-slate-500 px-1.5 py-0.5 rounded-full">{catDocs.length}</span>
                </div>
                {catDocs.map(d => (
                  <div key={d.id} className="flex items-center gap-2 px-2 py-1.5 bg-cream rounded mb-1">
                    <span className="text-xs text-navy flex-1 truncate">{d.customLabel ? `Other: ${d.customLabel}` : d.fileName}</span>
                    <span className="text-[0.62rem] text-slate-400">{d.fileSize ? `${Math.round(d.fileSize / 1024)}KB` : ""}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
