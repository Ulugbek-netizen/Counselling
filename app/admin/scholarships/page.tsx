"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/layout/topbar";

export default function AdminScholarshipsPage() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState(""); const [amount, setAmount] = useState(""); const [eligibility, setEligibility] = useState("");
  const [deadline, setDeadline] = useState(""); const [url, setUrl] = useState(""); const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  async function load() { const s = createClient() as any; const { data } = await s.from("scholarships").select("*").order("name"); setScholarships(data ?? []); }

  async function handleAdd() {
    setSaving(true);
    const s = createClient() as any;
    await s.from("scholarships").insert({ name, amount: amount ? parseFloat(amount) : null, eligibility: eligibility || null, deadline: deadline || null, url: url || null });
    setSaving(false); setShowAdd(false); setName(""); setAmount(""); setEligibility(""); setDeadline(""); setUrl("");
    await load();
  }

  const inputClass = "w-full px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy bg-white outline-none focus:border-navy transition-colors";

  return (
    <>
      <Topbar title="Scholarships" actions={<button onClick={() => setShowAdd(true)} className="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium">+ Add scholarship</button>} />
      <div className="flex-1 overflow-y-auto p-6">
        {showAdd && (
          <div className="bg-white border border-gold/30 rounded-card p-6 mb-6 max-w-lg">
            <h3 className="font-serif text-lg text-navy mb-4">Add scholarship</h3>
            <div className="space-y-3">
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Name *</label><input value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="Gates Millennium Scholarship" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Amount ($)</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} className={inputClass} placeholder="50000" /></div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Deadline</label><input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className={inputClass} /></div>
              </div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Eligibility</label><textarea value={eligibility} onChange={e => setEligibility(e.target.value)} className={inputClass + " min-h-[60px]"} placeholder="Who can apply?" /></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">URL</label><input value={url} onChange={e => setUrl(e.target.value)} className={inputClass} placeholder="https://..." /></div>
              <div className="flex gap-2">
                <button onClick={handleAdd} disabled={saving || !name} className="px-4 py-2 bg-gold text-white rounded-lg text-sm font-medium disabled:opacity-50">{saving ? "Saving…" : "Add scholarship"}</button>
                <button onClick={() => setShowAdd(false)} className="px-4 py-2 border border-cream-mid rounded-lg text-sm text-slate-500">Cancel</button>
              </div>
            </div>
          </div>
        )}
        <div className="text-sm text-slate-400 mb-2">{scholarships.length} scholarships in database</div>
        <div className="bg-white border border-cream-mid rounded-card overflow-hidden">
          {scholarships.map((s: any) => (
            <div key={s.id} className="flex items-center gap-3 px-4 py-3 border-b border-cream-mid last:border-b-0">
              <div className="flex-1"><div className="text-sm font-medium text-navy">{s.name}</div><div className="text-xs text-slate-400">{s.eligibility ?? "—"}</div></div>
              {s.amount && <span className="text-xs text-navy font-medium">${s.amount.toLocaleString()}</span>}
            </div>
          ))}
          {scholarships.length === 0 && <div className="text-center py-8 text-sm text-slate-300">No scholarships added yet</div>}
        </div>
      </div>
    </>
  );
}
