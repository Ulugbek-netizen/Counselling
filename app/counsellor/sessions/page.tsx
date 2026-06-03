"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/layout/topbar";

interface SessionRow { id: string; studentName: string; subject: string | null; scheduledAt: string | null; status: string; requestedBy: string; }
interface Student { id: string; name: string; }

export default function CounsellorSessionsPage() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [saving, setSaving] = useState(false);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const supabase = createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: profile } = await supabase.from("profiles").select("school_id").eq("id", user.id).single();
    if (!profile?.school_id) return;

    const { data: sessData } = await supabase.from("sessions").select("id, subject, scheduled_at, status, requested_by, student_id, profiles!sessions_student_id_fkey(first_name, last_name)").order("scheduled_at", { ascending: false });
    setSessions((sessData ?? []).map((s: any) => ({
      id: s.id, studentName: s.profiles ? `${s.profiles.first_name} ${s.profiles.last_name}` : "Student",
      subject: s.subject, scheduledAt: s.scheduled_at, status: s.status, requestedBy: s.requested_by,
    })));

    const { data: studs } = await supabase.from("profiles").select("id, first_name, last_name").eq("school_id", profile.school_id).eq("role", "student").order("last_name");
    setStudents((studs ?? []).map((s: any) => ({ id: s.id, name: `${s.first_name} ${s.last_name}` })));
  }

  async function handleCreate() {
    if (!selectedStudent || !date || !time) return;
    setSaving(true);
    const supabase = createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("sessions").insert({
      student_id: selectedStudent, counsellor_id: user?.id, requested_by: user?.id,
      subject: subject || null, scheduled_at: `${date}T${time}:00`, status: "approved",
    });
    setSaving(false); setShowCreate(false); setSubject(""); setDate(""); setTime(""); setSelectedStudent("");
    await loadData();
  }

  async function handleApprove(id: string) {
    const supabase = createClient() as any;
    await supabase.from("sessions").update({ status: "approved" }).eq("id", id);
    await loadData();
  }

  async function handleReschedule(id: string) {
    if (!newDate || !newTime) return;
    const supabase = createClient() as any;
    await supabase.from("sessions").update({ status: "rescheduled", proposed_at: `${newDate}T${newTime}:00` }).eq("id", id);
    setRescheduleId(null); setNewDate(""); setNewTime("");
    await loadData();
  }

  async function handleComplete(id: string) {
    const supabase = createClient() as any;
    await supabase.from("sessions").update({ status: "completed" }).eq("id", id);
    await loadData();
  }

  const STATUS_STYLES: Record<string, string> = {
    requested: "bg-amber-50 text-status-amber", approved: "bg-emerald-50 text-status-green",
    rescheduled: "bg-blue-50 text-status-blue", completed: "bg-gray-100 text-slate-500", cancelled: "bg-red-50 text-status-red",
  };
  const inputClass = "px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy bg-white outline-none focus:border-navy transition-colors";

  return (
    <>
      <Topbar title="Sessions" actions={<button onClick={() => setShowCreate(true)} className="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium">+ Schedule session</button>} />
      <div className="flex-1 overflow-y-auto p-6">
        {showCreate && (
          <div className="bg-white border border-gold/30 rounded-card p-6 mb-6 max-w-lg">
            <h3 className="font-serif text-lg text-navy mb-4">Schedule a session</h3>
            <div className="space-y-3">
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Student</label>
                <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className={inputClass + " w-full"}>
                  <option value="">Select student…</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Subject</label><input value={subject} onChange={e => setSubject(e.target.value)} className={inputClass + " w-full"} placeholder="Application review, essay feedback…" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputClass + " w-full"} /></div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Time</label><input type="time" value={time} onChange={e => setTime(e.target.value)} className={inputClass + " w-full"} /></div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleCreate} disabled={saving || !selectedStudent || !date || !time} className="px-4 py-2 bg-gold text-white rounded-lg text-sm font-medium disabled:opacity-50">{saving ? "Scheduling…" : "Schedule"}</button>
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 border border-cream-mid rounded-lg text-sm text-slate-500">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border border-cream-mid rounded-card overflow-hidden">
          <div className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1.5fr] px-4 py-2.5 border-b border-cream-mid bg-cream">
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Student</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Subject</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Date & time</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Status</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Actions</div>
          </div>
          {sessions.map(s => (
            <div key={s.id}>
              <div className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1.5fr] px-4 py-3 border-b border-cream-mid items-center">
                <div className="text-sm text-navy">{s.studentName}</div>
                <div className="text-sm text-slate-500">{s.subject ?? "—"}</div>
                <div className="text-xs text-slate-400">{s.scheduledAt ? new Date(s.scheduledAt).toLocaleString("en-GB", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}</div>
                <span className={`text-[0.65rem] font-medium px-1.5 py-0.5 rounded-full w-fit ${STATUS_STYLES[s.status] ?? ""}`}>{s.status}</span>
                <div className="flex gap-1.5">
                  {s.status === "requested" && (
                    <>
                      <button onClick={() => handleApprove(s.id)} className="px-2 py-1 bg-status-green text-white rounded text-[0.65rem] font-medium">Approve</button>
                      <button onClick={() => setRescheduleId(rescheduleId === s.id ? null : s.id)} className="px-2 py-1 bg-status-blue text-white rounded text-[0.65rem] font-medium">Reschedule</button>
                    </>
                  )}
                  {s.status === "approved" && <button onClick={() => handleComplete(s.id)} className="px-2 py-1 bg-gray-500 text-white rounded text-[0.65rem] font-medium">Complete</button>}
                </div>
              </div>
              {rescheduleId === s.id && (
                <div className="px-4 py-3 bg-blue-50 border-b border-cream-mid flex items-center gap-2">
                  <span className="text-xs text-slate-500">New time:</span>
                  <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="px-2 py-1.5 border border-cream-mid rounded text-xs text-navy bg-white outline-none" />
                  <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="px-2 py-1.5 border border-cream-mid rounded text-xs text-navy bg-white outline-none" />
                  <button onClick={() => handleReschedule(s.id)} className="px-2 py-1 bg-navy text-white rounded text-xs font-medium">Propose</button>
                </div>
              )}
            </div>
          ))}
          {sessions.length === 0 && <div className="text-center py-8 text-sm text-slate-300">No sessions yet</div>}
        </div>
      </div>
    </>
  );
}
