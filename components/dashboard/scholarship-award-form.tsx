"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  applicationId: string;
  studentId: string;
  universityTuition: number | null;
  onSaved?: () => void;
}

export function ScholarshipAwardForm({ applicationId, studentId, universityTuition, onSaved }: Props) {
  const [name, setName] = useState("");
  const [amountPerYear, setAmountPerYear] = useState("");
  const [type, setType] = useState<string>("partial");
  const [duration, setDuration] = useState("4");
  const [renewable, setRenewable] = useState("no");
  const [conditions, setConditions] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const inputClass = "w-full px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy bg-white outline-none focus:border-navy transition-colors";

  const amount = amountPerYear ? parseFloat(amountPerYear) : 0;
  const years = duration ? parseInt(duration) : 4;
  const total = amount * years;

  const coveragePercent = universityTuition && universityTuition > 0 && amount > 0
    ? Math.round((amount / universityTuition) * 100)
    : null;

  async function handleSave() {
    if (!name) return;
    setSaving(true);
    const supabase = createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from("scholarship_awards").insert({
      application_id: applicationId, student_id: studentId,
      scholarship_name: name, amount_per_year: amount || null,
      scholarship_type: type, duration_years: years,
      is_renewable: renewable === "yes" || renewable === "conditional",
      renewable_conditions: renewable === "conditional" ? conditions : null,
      total_amount: total || null, entered_by: user?.id,
    });

    setSaving(false); setSaved(true);
    onSaved?.();
  }

  if (saved) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 text-center">
        <div className="text-status-green font-medium text-sm mb-1">Scholarship recorded ✓</div>
        <div className="text-xs text-status-green/60">{name} — ${total.toLocaleString()} total ({years} years)</div>
        <button onClick={() => { setSaved(false); setName(""); setAmountPerYear(""); }} className="mt-2 text-xs text-status-green font-medium hover:underline">Add another</button>
      </div>
    );
  }

  return (
    <div className="border border-gold/30 bg-gold/5 rounded-lg p-4">
      <h4 className="font-serif text-sm text-navy mb-3">🎓 Record scholarship award</h4>
      <div className="space-y-2">
        <div><label className="block text-[0.68rem] font-medium text-slate-500 mb-0.5">Scholarship name</label><input value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="Merit Scholarship" /></div>
        <div className="grid grid-cols-3 gap-2">
          <div><label className="block text-[0.68rem] font-medium text-slate-500 mb-0.5">Amount/year ($)</label><input type="number" value={amountPerYear} onChange={e => setAmountPerYear(e.target.value)} className={inputClass} placeholder="20000" /></div>
          <div>
            <label className="block text-[0.68rem] font-medium text-slate-500 mb-0.5">Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className={inputClass}>
              <option value="full_tuition">Full tuition</option><option value="partial">Partial</option>
              <option value="fixed_amount">Fixed amount</option><option value="living_stipend">Living stipend</option>
            </select>
          </div>
          <div><label className="block text-[0.68rem] font-medium text-slate-500 mb-0.5">Duration (years)</label><input type="number" value={duration} onChange={e => setDuration(e.target.value)} className={inputClass} /></div>
        </div>
        <div>
          <label className="block text-[0.68rem] font-medium text-slate-500 mb-0.5">Renewable?</label>
          <div className="flex gap-3">
            {["no", "yes", "conditional"].map(opt => (
              <label key={opt} className="flex items-center gap-1.5 text-xs text-slate-500"><input type="radio" name="renewable" checked={renewable === opt} onChange={() => setRenewable(opt)} className="accent-navy" />{opt === "conditional" ? "Conditional" : opt === "yes" ? "Yes" : "No"}</label>
            ))}
          </div>
          {renewable === "conditional" && <input value={conditions} onChange={e => setConditions(e.target.value)} className={inputClass + " mt-1"} placeholder="e.g. Maintain 3.5 GPA" />}
        </div>

        {/* Auto-calculated */}
        {amount > 0 && (
          <div className="bg-cream rounded-lg p-3 grid grid-cols-3 gap-2 text-center">
            <div><div className="font-serif text-base text-navy">${amount.toLocaleString()}</div><div className="text-[0.6rem] text-slate-400">Per year</div></div>
            <div><div className="font-serif text-base text-navy">${total.toLocaleString()}</div><div className="text-[0.6rem] text-slate-400">Total ({years} yrs)</div></div>
            {coveragePercent !== null && <div><div className="font-serif text-base text-navy">{coveragePercent}%</div><div className="text-[0.6rem] text-slate-400">Tuition covered</div></div>}
          </div>
        )}

        <button onClick={handleSave} disabled={saving || !name} className="px-4 py-2 bg-gold text-white rounded-lg text-sm font-medium disabled:opacity-50">{saving ? "Saving…" : "Save scholarship"}</button>
      </div>
    </div>
  );
}
