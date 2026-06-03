"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/layout/topbar";

interface EssayRow {
  id: string;
  title: string;
  content: string | null;
  status: string;
  student_name: string;
  updated_at: string;
}

export default function CounsellorEssaysPage() {
  const [essays, setEssays] = useState<EssayRow[]>([]);
  const [selected, setSelected] = useState<EssayRow | null>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<{ id: string; content: string; created_at: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadEssays(); }, []);

  async function loadEssays() {
    const supabase = createClient() as any;
    const { data } = await supabase
      .from("essays")
      .select("id, title, content, status, updated_at, student_id, profiles!essays_student_id_fkey(first_name, last_name)")
      .in("status", ["draft", "submitted_for_review", "final"])
      .order("updated_at", { ascending: false });

    setEssays((data ?? []).map((e: any) => ({
      id: e.id, title: e.title, content: e.content, status: e.status, updated_at: e.updated_at,
      student_name: e.profiles ? `${e.profiles.first_name} ${e.profiles.last_name}` : "Student",
    })));
  }

  async function selectEssay(e: EssayRow) {
    setSelected(e);
    const supabase = createClient() as any;
    const { data } = await supabase.from("essay_comments").select("id, content, created_at").eq("essay_id", e.id).order("created_at");
    setComments(data ?? []);
  }

  async function handleAddComment() {
    if (!comment.trim() || !selected) return;
    setSaving(true);
    const supabase = createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("essay_comments").insert({ essay_id: selected.id, author_id: user?.id, content: comment });
    setComment("");
    setSaving(false);
    await selectEssay(selected);
  }

  async function handleMarkFinal() {
    if (!selected) return;
    const supabase = createClient() as any;
    await supabase.from("essays").update({ status: "final" }).eq("id", selected.id);
    await loadEssays();
  }

  const STATUS_STYLES: Record<string, string> = {
    draft: "bg-amber-50 text-status-amber",
    submitted_for_review: "bg-blue-50 text-status-blue",
    final: "bg-emerald-50 text-status-green",
  };
  const STATUS_LABELS: Record<string, string> = {
    draft: "Draft", submitted_for_review: "Needs review", final: "Final",
  };

  return (
    <>
      <Topbar title="Essays" />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[300px] flex-shrink-0 border-r border-cream-mid bg-white overflow-y-auto">
          {essays.map(e => (
            <div key={e.id} onClick={() => selectEssay(e)} className={`px-4 py-3 border-b border-cream-mid cursor-pointer transition-colors ${selected?.id === e.id ? "bg-cream" : "hover:bg-cream/50"}`}>
              <div className="text-sm font-medium text-navy truncate">{e.title}</div>
              <div className="text-xs text-slate-400">{e.student_name}</div>
              <span className={`text-[0.62rem] font-medium px-1.5 py-0.5 rounded-full mt-1 inline-block ${STATUS_STYLES[e.status] ?? ""}`}>{STATUS_LABELS[e.status] ?? e.status}</span>
            </div>
          ))}
          {essays.length === 0 && <div className="text-center text-sm text-slate-300 py-8">No essays submitted yet</div>}
        </div>

        {selected ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-3 border-b border-cream-mid bg-white flex items-center gap-3">
              <div className="flex-1">
                <div className="font-serif text-lg text-navy">{selected.title}</div>
                <div className="text-xs text-slate-400">{selected.student_name}</div>
              </div>
              {selected.status === "submitted_for_review" && (
                <button onClick={handleMarkFinal} className="px-3 py-1.5 bg-status-green text-white rounded-lg text-xs font-medium">Mark as final ✓</button>
              )}
            </div>
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 p-6 overflow-y-auto bg-cream">
                <div className="prose prose-sm max-w-none text-navy whitespace-pre-wrap">{selected.content ?? "No content yet."}</div>
              </div>
              <div className="w-[280px] flex-shrink-0 border-l border-cream-mid bg-white flex flex-col">
                <div className="p-4 flex-1 overflow-y-auto">
                  <div className="text-[0.65rem] font-semibold tracking-widest uppercase text-slate-400 mb-3">Comments</div>
                  {comments.map(c => (
                    <div key={c.id} className="bg-cream rounded-lg p-3 mb-2">
                      <p className="text-xs text-navy">{c.content}</p>
                      <p className="text-[0.62rem] text-slate-400 mt-1">{new Date(c.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                  {comments.length === 0 && <p className="text-xs text-slate-300 text-center py-4">No comments yet</p>}
                </div>
                <div className="p-3 border-t border-cream-mid">
                  <textarea value={comment} onChange={e => setComment(e.target.value)} className="w-full px-3 py-2 border border-cream-mid rounded-lg text-xs text-navy resize-none h-20 outline-none focus:border-navy" placeholder="Add feedback…" />
                  <button onClick={handleAddComment} disabled={saving || !comment.trim()} className="mt-2 w-full py-1.5 bg-navy text-white rounded-lg text-xs font-medium disabled:opacity-50">
                    {saving ? "Sending…" : "Add comment"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center"><div className="text-sm text-slate-300">Select an essay to review</div></div>
        )}
      </div>
    </>
  );
}
