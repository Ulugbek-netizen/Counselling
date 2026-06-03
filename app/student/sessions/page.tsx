"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/layout/topbar";

interface SessionRow { id: string; counsellorName: string; subject: string | null; scheduledAt: string | null; status: string; }
interface Counsellor { id: string; name: string; title: string | null; }

export default function StudentSessionsPage() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [showRequest, setShowRequest] = useState(false);
  const [selectedCounsellor, setSelectedCounsellor] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const supabase = createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase.from("profiles").select("school_id").eq("id", user.id).single();
    if (!profile?.school_id) return;

    // Load sessions
    const { data: sessData } = await supabase.from("sessions").select("id, subject, scheduled_at, status, counsellor_id, profiles!sessions_counsellor_id_fkey(first_name, last_name)").eq("student_id", user.id).order("scheduled_at", { ascending: false });
    setSessions((sessData ?? []).map((s: any) => ({
      id: s.id, counsellorName: s.profiles ? `${s.profiles.first_name} ${s.profiles.last_name}` : "Counsellor",
      subject: s.subject, scheduledAt: s.scheduled_at, status: s.status,
    })));

    // Load available counsellors
    const { data: couns } = await supabase.from("profiles").select("id, first_name, last_name, title").eq("school_id", profile.school_id).in("role", ["counsellor", "school_admin"]).eq("show_as_counsellor", true);
    setCounsellors((couns ?? []).map((c: any) => ({ id: c.id, name: `${c.first_name} ${c.last_name}`, title: c.title })));
  }

  async function handleRequest() {
    if (!selectedCounsellor || !date || !time) return;
    setSaving(true);
    const supabase = createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();
    const scheduledAt = `${date}T${time}:00`;
    await supabase.from("sessions").insert({
      student_id: user?.id, counsellor_id: selectedCounsellor, requested_by: user?.id,
      subject: subject || null, scheduled_at: scheduledAt, status: "requested",
    });
    setSaving(false); setShowRequest(false); setSubject(""); setDate(""); setTime(""); setSelectedCounsellor("");
    await loadData();
  }

  const STATUS_STYLES: Record<string, string> = {
    requested: "bg-amber-50 text-status-amber", approved: "bg-emerald-50 text-status-green",
    rescheduled: "bg-blue-50 text-status-blue", completed: "bg-gray-100 text-slate-500", cancelled: "bg-red-50 text-status-red",
  };

  const inputClass = "w-full px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy bg-white outline-none focus:border-navy transition-colors";

  return (
    <>
      <Topbar title="Sessions" actions={<button onClick={() => setShowRequest(true)} className="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium">+ Request session</button>} />
      <div className="flex-1 overflow-y-auto p-6">
        {showRequest && (
          <div className="bg-white border border-gold/30 rounded-card p-6 mb-6 max-w-lg">
            <h3 className="font-serif text-lg text-navy mb-4">Request a session</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Counsellor</label>
                <select value={selectedCounsellor} onChange={e => setSelectedCounsellor(e.target.value)} className={inputClass}>
                  <option value="">Select counsellor…</option>
                  {counsellors.map(c => <option key={c.id} value={c.id}>{c.name}{c.title ? ` · ${c.title}` : ""}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Subject / note</label><input value={subject} onChange={e => setSubject(e.target.value)} className={inputClass} placeholder="What would you like to discuss?" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Preferred date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputClass} /></div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Preferred time</label><input type="time" value={time} onChange={e => setTime(e.target.value)} className={inputClass} /></div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleRequest} disabled={saving || !selectedCounsellor || !date || !time} className="px-4 py-2 bg-gold text-white rounded-lg text-sm font-medium disabled:opacity-50">{saving ? "Sending…" : "Send request"}</button>
                <button onClick={() => setShowRequest(false)} className="px-4 py-2 border border-cream-mid rounded-lg text-sm text-slate-500">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border border-cream-mid rounded-card overflow-hidden">
          <div className="grid grid-cols-[1.5fr_2fr_1fr_1fr_80px] px-4 py-2.5 border-b border-cream-mid bg-cream">
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Counsellor</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Subject</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Date & time</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Status</div>
            <div />
          </div>
          {sessions.map(s => (
            <div key={s.id} className="grid grid-cols-[1.5fr_2fr_1fr_1fr_80px] px-4 py-3 border-b border-cream-mid last:border-b-0 items-center">
              <div className="text-sm text-navy">{s.counsellorName}</div>
              <div className="text-sm text-slate-500">{s.subject ?? "—"}</div>
              <div className="text-xs text-slate-400">{s.scheduledAt ? new Date(s.scheduledAt).toLocaleString("en-GB", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}</div>
              <span className={`text-[0.65rem] font-medium px-1.5 py-0.5 rounded-full w-fit ${STATUS_STYLES[s.status] ?? ""}`}>{s.status}</span>
              <div />
            </div>
          ))}
          {sessions.length === 0 && <div className="text-center py-8 text-sm text-slate-300">No sessions yet. Request one above.</div>}
        </div>
      </div>
    </>
  );
}
