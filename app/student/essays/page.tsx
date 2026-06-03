"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/layout/topbar";

interface Essay {
  id: string;
  title: string;
  content: string | null;
  status: string;
  university_id: string | null;
  updated_at: string;
  comments: { id: string; content: string; author_id: string; created_at: string }[];
}

export default function StudentEssaysPage() {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [selected, setSelected] = useState<Essay | null>(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => { loadEssays(); }, []);

  async function loadEssays() {
    const supabase = createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("essays")
      .select("id, title, content, status, university_id, updated_at")
      .eq("student_id", user.id)
      .order("updated_at", { ascending: false });

    const essaysWithComments: Essay[] = [];
    for (const e of (data ?? [])) {
      const { data: comments } = await supabase.from("essay_comments").select("id, content, author_id, created_at").eq("essay_id", e.id).order("created_at");
      essaysWithComments.push({ ...e, comments: comments ?? [] });
    }
    setEssays(essaysWithComments);
    if (essaysWithComments.length > 0 && !selected) {
      setSelected(essaysWithComments[0]);
      setContent(essaysWithComments[0].content ?? "");
      setTitle(essaysWithComments[0].title);
    }
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    const supabase = createClient() as any;
    await supabase.from("essays").update({ content, title, status: "draft" }).eq("id", selected.id);
    setSaving(false);
    await loadEssays();
  }

  async function handleSubmitForReview() {
    if (!selected) return;
    setSaving(true);
    const supabase = createClient() as any;
    await supabase.from("essays").update({ content, title, status: "submitted_for_review" }).eq("id", selected.id);
    setSaving(false);
    await loadEssays();
  }

  async function handleCreateEssay() {
    if (!newTitle) return;
    const supabase = createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("essays").insert({ student_id: user.id, title: newTitle, status: "not_started" });
    setNewTitle("");
    setShowNew(false);
    await loadEssays();
  }

  function selectEssay(e: Essay) {
    setSelected(e);
    setContent(e.content ?? "");
    setTitle(e.title);
  }

  const STATUS_STYLES: Record<string, string> = {
    not_started: "bg-gray-100 text-slate-500",
    draft: "bg-amber-50 text-status-amber",
    submitted_for_review: "bg-blue-50 text-status-blue",
    final: "bg-emerald-50 text-status-green",
  };
  const STATUS_LABELS: Record<string, string> = {
    not_started: "Not started", draft: "Draft", submitted_for_review: "Under review", final: "Final",
  };

  return (
    <>
      <Topbar title="Essays" actions={<button onClick={() => setShowNew(true)} className="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium">+ New essay</button>} />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar list */}
        <div className="w-[280px] flex-shrink-0 border-r border-cream-mid bg-white overflow-y-auto">
          {showNew && (
            <div className="p-3 border-b border-cream-mid">
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy" placeholder="Essay title…" onKeyDown={e => e.key === "Enter" && handleCreateEssay()} />
              <div className="flex gap-2 mt-2">
                <button onClick={handleCreateEssay} className="px-3 py-1 bg-gold text-white rounded text-xs font-medium">Create</button>
                <button onClick={() => setShowNew(false)} className="px-3 py-1 text-xs text-slate-400">Cancel</button>
              </div>
            </div>
          )}
          {essays.map(e => (
            <div key={e.id} onClick={() => selectEssay(e)} className={`px-4 py-3 border-b border-cream-mid cursor-pointer transition-colors ${selected?.id === e.id ? "bg-cream" : "hover:bg-cream/50"}`}>
              <div className="text-sm font-medium text-navy truncate">{e.title}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[0.62rem] font-medium px-1.5 py-0.5 rounded-full ${STATUS_STYLES[e.status] ?? ""}`}>{STATUS_LABELS[e.status] ?? e.status}</span>
                {e.comments.length > 0 && <span className="text-[0.62rem] text-slate-400">{e.comments.length} comment{e.comments.length !== 1 ? "s" : ""}</span>}
              </div>
            </div>
          ))}
          {essays.length === 0 && !showNew && (
            <div className="text-center text-sm text-slate-300 py-8">No essays yet</div>
          )}
        </div>

        {/* Editor */}
        {selected ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-3 border-b border-cream-mid bg-white flex items-center gap-3">
              <input value={title} onChange={e => setTitle(e.target.value)} className="flex-1 font-serif text-lg text-navy outline-none bg-transparent" placeholder="Essay title" />
              <button onClick={handleSave} disabled={saving} className="px-3 py-1.5 border border-cream-mid rounded-lg text-xs text-slate-500 hover:bg-cream transition-colors">
                {saving ? "Saving…" : "Save draft"}
              </button>
              {selected.status !== "submitted_for_review" && selected.status !== "final" && (
                <button onClick={handleSubmitForReview} disabled={saving} className="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium hover:bg-navy-mid transition-colors">
                  Submit for review
                </button>
              )}
            </div>
            <div className="flex-1 flex overflow-hidden">
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                className="flex-1 p-6 resize-none outline-none text-sm text-navy leading-relaxed bg-cream"
                placeholder="Start writing your essay…"
              />
              {/* Comments panel */}
              {selected.comments.length > 0 && (
                <div className="w-[260px] flex-shrink-0 border-l border-cream-mid bg-white overflow-y-auto p-4">
                  <div className="text-[0.65rem] font-semibold tracking-widest uppercase text-slate-400 mb-3">Counsellor feedback</div>
                  {selected.comments.map(c => (
                    <div key={c.id} className="bg-cream rounded-lg p-3 mb-2">
                      <p className="text-xs text-navy">{c.content}</p>
                      <p className="text-[0.62rem] text-slate-400 mt-1">{new Date(c.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl opacity-20 mb-2">✍️</div>
              <div className="text-sm text-slate-300">Select an essay or create a new one</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
