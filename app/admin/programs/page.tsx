"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/layout/topbar";

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState(""); const [type, setType] = useState(""); const [host, setHost] = useState("");
  const [location, setLocation] = useState(""); const [country, setCountry] = useState(""); const [price, setPrice] = useState("");
  const [deadline, setDeadline] = useState(""); const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  async function load() {
    const supabase = createClient() as any;
    const { data } = await supabase.from("programs").select("*").order("name");
    setPrograms(data ?? []);
  }

  async function handleAdd() {
    setSaving(true);
    const supabase = createClient() as any;
    await supabase.from("programs").insert({
      name, type: type || null, host_institution: host || null,
      location: location || null, country: country || null,
      price: price ? parseFloat(price) : null, is_free: !price || price === "0",
      deadline: deadline || null, description: description || null,
    });
    setSaving(false); setShowAdd(false);
    setName(""); setType(""); setHost(""); setLocation(""); setCountry(""); setPrice(""); setDeadline(""); setDescription("");
    await load();
  }

  const inputClass = "w-full px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy bg-white outline-none focus:border-navy transition-colors";

  return (
    <>
      <Topbar title="Programs & Olympiads" actions={<button onClick={() => setShowAdd(true)} className="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium">+ Add program</button>} />
      <div className="flex-1 overflow-y-auto p-6">
        {showAdd && (
          <div className="bg-white border border-gold/30 rounded-card p-6 mb-6 max-w-lg">
            <h3 className="font-serif text-lg text-navy mb-4">Add program</h3>
            <div className="space-y-3">
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Name *</label><input value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="Intel ISEF" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Type</label><input value={type} onChange={e => setType(e.target.value)} className={inputClass} placeholder="Olympiad, Summer program…" /></div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Host institution</label><input value={host} onChange={e => setHost(e.target.value)} className={inputClass} placeholder="Society for Science" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Location</label><input value={location} onChange={e => setLocation(e.target.value)} className={inputClass} placeholder="Los Angeles" /></div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Country</label><input value={country} onChange={e => setCountry(e.target.value)} className={inputClass} placeholder="US" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Price ($)</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} className={inputClass} placeholder="0 for free" /></div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Deadline</label><input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className={inputClass} /></div>
              </div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} className={inputClass + " min-h-[60px]"} /></div>
              <div className="flex gap-2">
                <button onClick={handleAdd} disabled={saving || !name} className="px-4 py-2 bg-gold text-white rounded-lg text-sm font-medium disabled:opacity-50">{saving ? "Saving…" : "Add program"}</button>
                <button onClick={() => setShowAdd(false)} className="px-4 py-2 border border-cream-mid rounded-lg text-sm text-slate-500">Cancel</button>
              </div>
            </div>
          </div>
        )}
        <div className="text-sm text-slate-400 mb-2">{programs.length} programs in database</div>
        <div className="bg-white border border-cream-mid rounded-card overflow-hidden">
          {programs.map((p: any) => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3 border-b border-cream-mid last:border-b-0">
              <div className="flex-1"><div className="text-sm font-medium text-navy">{p.name}</div><div className="text-xs text-slate-400">{p.host_institution ?? ""} {p.location ? `· ${p.location}` : ""}</div></div>
              {p.type && <span className="text-[0.62rem] font-medium px-1.5 py-0.5 rounded-full bg-purple-50 text-status-purple">{p.type}</span>}
              {p.deadline && <span className="text-xs text-slate-400">{p.deadline}</span>}
            </div>
          ))}
          {programs.length === 0 && <div className="text-center py-8 text-sm text-slate-300">No programs added yet</div>}
        </div>
      </div>
    </>
  );
}
