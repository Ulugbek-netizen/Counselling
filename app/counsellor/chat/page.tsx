"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/layout/topbar";

interface Broadcast { id: string; content: string; audienceType: string; recipientCount: number; senderName: string; senderId: string; createdAt: string; }

export default function CounsellorChatPage() {
  const [tab, setTab] = useState<"messages" | "broadcast">("messages");
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [content, setContent] = useState("");
  const [audienceType, setAudienceType] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("");
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState("");
  const [schoolId, setSchoolId] = useState("");

  useEffect(() => {
    async function init() {
      const supabase = createClient() as any;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const { data: profile } = await supabase.from("profiles").select("school_id").eq("id", user.id).single();
      if (profile?.school_id) { setSchoolId(profile.school_id); loadBroadcasts(profile.school_id); }
    }
    init();
  }, []);

  async function loadBroadcasts(sid: string) {
    const supabase = createClient() as any;
    const { data } = await supabase.from("broadcasts").select("id, content, audience_type, audience_filter, recipient_count, sender_id, created_at, profiles!broadcasts_sender_id_fkey(first_name, last_name)").eq("school_id", sid).order("created_at", { ascending: false });
    setBroadcasts((data ?? []).map((b: any) => ({
      id: b.id, content: b.content, audienceType: b.audience_type, recipientCount: b.recipient_count,
      senderName: b.profiles ? `${b.profiles.first_name} ${b.profiles.last_name}` : "Counsellor",
      senderId: b.sender_id, createdAt: b.created_at,
    })));
  }

  async function handleSendBroadcast() {
    if (!content.trim()) return;
    setSending(true);
    const supabase = createClient() as any;

    // Count recipients
    let query = supabase.from("profiles").select("id", { count: "exact", head: true }).eq("school_id", schoolId).eq("role", "student");
    if (audienceType === "grade" && gradeFilter) query = query.eq("grade", gradeFilter);
    const { count } = await query;

    await supabase.from("broadcasts").insert({
      school_id: schoolId, sender_id: userId, content,
      audience_type: audienceType === "grade" ? `Grade ${gradeFilter}` : "All students",
      audience_filter: audienceType === "grade" ? { grade: gradeFilter } : null,
      recipient_count: count ?? 0,
    });

    setContent(""); setShowCompose(false); setSending(false);
    await loadBroadcasts(schoolId);
  }

  async function handleDelete(id: string) {
    const supabase = createClient() as any;
    await supabase.from("broadcasts").delete().eq("id", id);
    await loadBroadcasts(schoolId);
  }

  const inputClass = "w-full px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy bg-white outline-none focus:border-navy transition-colors";

  // Dynamic import of ChatInterface for the messages tab
  const ChatInterfaceWrapper = () => {
    const [ChatInterface, setChatInterface] = useState<any>(null);
    useEffect(() => {
      import("@/components/dashboard/chat-interface").then(m => setChatInterface(() => m.ChatInterface));
    }, []);
    if (!ChatInterface || !userId || !schoolId) return null;
    return <ChatInterface userId={userId} userRole="counsellor" schoolId={schoolId} />;
  };

  return (
    <>
      <Topbar title="Chat" actions={
        <div className="flex gap-1 bg-cream-mid rounded-lg p-0.5">
          <button onClick={() => setTab("messages")} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${tab === "messages" ? "bg-white text-navy shadow-sm" : "text-slate-400"}`}>Messages</button>
          <button onClick={() => setTab("broadcast")} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${tab === "broadcast" ? "bg-white text-navy shadow-sm" : "text-slate-400"}`}>Broadcast</button>
        </div>
      } />

      {tab === "messages" ? (
        <ChatInterfaceWrapper />
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-slate-400">{broadcasts.length} broadcasts sent</div>
            <button onClick={() => setShowCompose(true)} className="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium">+ New broadcast</button>
          </div>

          {showCompose && (
            <div className="bg-white border border-gold/30 rounded-card p-6 mb-6 max-w-lg">
              <h3 className="font-serif text-lg text-navy mb-4">Compose broadcast</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Audience</label>
                  <div className="flex gap-2">
                    <button onClick={() => setAudienceType("all")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${audienceType === "all" ? "bg-navy text-white" : "border border-cream-mid text-slate-500"}`}>All students</button>
                    <button onClick={() => setAudienceType("grade")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${audienceType === "grade" ? "bg-navy text-white" : "border border-cream-mid text-slate-500"}`}>By grade</button>
                  </div>
                  {audienceType === "grade" && (
                    <select value={gradeFilter} onChange={e => setGradeFilter(e.target.value)} className={inputClass + " mt-2"}>
                      <option value="">Select grade…</option>
                      {["9", "10", "11", "12"].map(g => <option key={g} value={g}>Grade {g}</option>)}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Message</label>
                  <textarea value={content} onChange={e => setContent(e.target.value)} className={inputClass + " min-h-[100px]"} placeholder="Type your broadcast message…" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSendBroadcast} disabled={sending || !content.trim()} className="px-4 py-2 bg-gold text-white rounded-lg text-sm font-medium disabled:opacity-50">{sending ? "Sending…" : "Send broadcast"}</button>
                  <button onClick={() => setShowCompose(false)} className="px-4 py-2 border border-cream-mid rounded-lg text-sm text-slate-500">Cancel</button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {broadcasts.map(b => (
              <div key={b.id} className="bg-white border border-cream-mid rounded-card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-medium text-navy">{b.senderName}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="bg-blue-50 text-status-blue text-[0.62rem] font-medium px-1.5 py-0.5 rounded-full">📢 {b.audienceType}</span>
                      <span className="text-[0.62rem] text-slate-400">{b.recipientCount} recipients</span>
                      <span className="text-[0.62rem] text-slate-400">{new Date(b.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {b.senderId === userId && (
                    <button onClick={() => handleDelete(b.id)} className="text-xs text-slate-400 hover:text-status-red transition-colors">Delete</button>
                  )}
                </div>
                <p className="text-sm text-slate-600">{b.content}</p>
              </div>
            ))}
            {broadcasts.length === 0 && <div className="text-center py-12 text-sm text-slate-300">No broadcasts sent yet</div>}
          </div>
        </div>
      )}
    </>
  );
}
