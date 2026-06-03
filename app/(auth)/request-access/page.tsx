"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface School { id: string; name: string; }

export default function RequestAccessPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [schoolNotFound, setSchoolNotFound] = useState(false);

  useEffect(() => {
    async function loadSchools() {
      const supabase = createClient() as any;
      const { data } = await supabase.from("schools").select("id, name").order("name");
      setSchools(data ?? []);
    }
    loadSchools();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    const supabase = createClient() as any;
    await supabase.from("access_requests").insert({
      student_name: name,
      email,
      school_id: schoolId || null,
      school_name_if_missing: schoolId ? null : "Not found",
      note: note || null,
      is_sales_lead: !schoolId,
      status: "pending",
    });
    setSending(false);
    setSubmitted(true);
  }

  const inputClass = "w-full px-3 py-2.5 bg-white border border-cream-mid rounded-[10px] text-sm text-navy outline-none focus:border-navy transition-colors";

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-full max-w-sm text-center">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-status-green text-xl">✓</span>
          </div>
          <h2 className="font-serif text-xl text-navy mb-2">Request sent</h2>
          <p className="text-sm text-slate-400 mb-6">Your school will review your request and send you an invitation if approved.</p>
          <Link href="/sign-in" className="text-sm text-navy font-medium hover:underline">← Back to sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl text-navy mb-1 text-center">Request access</h1>
        <p className="text-sm text-slate-400 text-center mb-6">Ask your school to add you to EduPath.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Your name</label>
            <input value={name} onChange={e => setName(e.target.value)} required className={inputClass} placeholder="Full name" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} placeholder="you@email.com" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Your school</label>
            <select value={schoolId} onChange={e => { setSchoolId(e.target.value); setSchoolNotFound(false); }} className={inputClass}>
              <option value="">Select your school…</option>
              {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            {!schoolId && (
              <button type="button" onClick={() => setSchoolNotFound(true)} className="text-xs text-slate-400 mt-1 hover:text-navy">
                My school isn&apos;t listed
              </button>
            )}
            {schoolNotFound && (
              <div className="mt-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <p className="text-xs text-status-amber">Your school isn&apos;t on EduPath yet. We&apos;ll notify them about your interest. You can also contact your school administration directly to request they join.</p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Note (optional)</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} className={inputClass + " min-h-[60px]"} placeholder="Anything you'd like to add…" />
          </div>
          <button type="submit" disabled={sending || !name || !email} className="w-full py-2.5 bg-navy text-white rounded-[10px] font-medium text-sm hover:bg-navy-mid transition-colors disabled:opacity-50">
            {sending ? "Sending…" : "Send request"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-4">
          <Link href="/sign-in" className="text-navy font-medium hover:underline">← Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
