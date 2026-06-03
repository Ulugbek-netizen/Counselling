"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/layout/topbar";

interface SchoolRow { id: string; name: string; country: string | null; city: string | null; tier: string; status: string; studentCount: number; counsellorCount: number; maxStudents: number; maxCounsellors: number; }

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState(""); const [country, setCountry] = useState(""); const [city, setCity] = useState("");
  const [adminEmail, setAdminEmail] = useState(""); const [adminName, setAdminName] = useState(""); const [tier, setTier] = useState("starter");
  const [saving, setSaving] = useState(false); const [inviteLink, setInviteLink] = useState("");

  useEffect(() => { load(); }, []);
  async function load() {
    const supabase = createClient() as any;
    const { data: schoolsData } = await supabase.from("schools").select("id, name, country, city, subscription_tier, subscription_status, max_students, max_counsellors");

    const rows: SchoolRow[] = [];
    for (const s of (schoolsData ?? [])) {
      const { count: students } = await supabase.from("profiles").select("id", { count: "exact", head: true }).eq("school_id", s.id).eq("role", "student");
      const { count: counsellors } = await supabase.from("profiles").select("id", { count: "exact", head: true }).eq("school_id", s.id).in("role", ["counsellor", "school_admin"]);
      rows.push({ id: s.id, name: s.name, country: s.country, city: s.city, tier: s.subscription_tier, status: s.subscription_status, studentCount: students ?? 0, counsellorCount: counsellors ?? 0, maxStudents: s.max_students, maxCounsellors: s.max_counsellors });
    }
    setSchools(rows);
  }

  async function handleAddSchool() {
    setSaving(true);
    const supabase = createClient() as any;

    const maxMap: Record<string, { students: number; counsellors: number }> = {
      starter: { students: 50, counsellors: 3 }, growth: { students: 150, counsellors: 8 },
      professional: { students: 350, counsellors: 15 }, enterprise: { students: 9999, counsellors: 999 },
    };

    const { data: school } = await supabase.from("schools").insert({
      name, country: country || null, city: city || null,
      subscription_tier: tier, max_students: maxMap[tier].students, max_counsellors: maxMap[tier].counsellors,
    }).select("id").single();

    if (school && adminEmail) {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail, role: "school_admin", schoolId: school.id }),
      });
      const data = await res.json();
      if (data.inviteLink) setInviteLink(data.inviteLink);
    }

    setSaving(false); setShowAdd(false);
    setName(""); setCountry(""); setCity(""); setAdminEmail(""); setAdminName(""); setTier("starter");
    await load();
  }

  const TIER_STYLES: Record<string, string> = { starter: "bg-gray-100 text-slate-500", growth: "bg-blue-50 text-status-blue", professional: "bg-purple-50 text-status-purple", enterprise: "bg-gold/10 text-gold" };
  const STATUS_STYLES: Record<string, string> = { active: "bg-emerald-50 text-status-green", grace_period: "bg-amber-50 text-status-amber", expired: "bg-red-50 text-status-red", suspended: "bg-gray-100 text-slate-500" };
  const inputClass = "w-full px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy bg-white outline-none focus:border-navy transition-colors";

  return (
    <>
      <Topbar title="Schools" actions={<button onClick={() => setShowAdd(true)} className="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium">+ Add school</button>} />
      <div className="flex-1 overflow-y-auto p-6">
        {inviteLink && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-card p-4 mb-4">
            <div className="text-sm font-medium text-status-green mb-1">Invitation sent</div>
            <div className="text-xs text-slate-500 break-all">{inviteLink}</div>
            <button onClick={() => { navigator.clipboard.writeText(inviteLink); }} className="mt-2 text-xs text-status-green font-medium hover:underline">Copy link</button>
          </div>
        )}

        {showAdd && (
          <div className="bg-white border border-gold/30 rounded-card p-6 mb-6 max-w-lg">
            <h3 className="font-serif text-lg text-navy mb-4">Add new school</h3>
            <div className="space-y-3">
              <div><label className="block text-xs font-medium text-slate-500 mb-1">School name *</label><input value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="International School of…" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Country</label><input value={country} onChange={e => setCountry(e.target.value)} className={inputClass} /></div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">City</label><input value={city} onChange={e => setCity(e.target.value)} className={inputClass} /></div>
              </div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Tier</label>
                <select value={tier} onChange={e => setTier(e.target.value)} className={inputClass}>
                  <option value="starter">Starter ($25/mo)</option><option value="growth">Growth ($55/mo)</option>
                  <option value="professional">Professional ($99/mo)</option><option value="enterprise">Enterprise (custom)</option>
                </select>
              </div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Admin name</label><input value={adminName} onChange={e => setAdminName(e.target.value)} className={inputClass} placeholder="School admin name" /></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Admin email *</label><input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className={inputClass} placeholder="admin@school.edu" /></div>
              <div className="flex gap-2">
                <button onClick={handleAddSchool} disabled={saving || !name} className="px-4 py-2 bg-gold text-white rounded-lg text-sm font-medium disabled:opacity-50">{saving ? "Creating…" : "Create school & send invite"}</button>
                <button onClick={() => setShowAdd(false)} className="px-4 py-2 border border-cream-mid rounded-lg text-sm text-slate-500">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border border-cream-mid rounded-card overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_80px_1fr_1fr_80px] px-4 py-2.5 border-b border-cream-mid bg-cream">
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">School</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Location</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Tier</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Students</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Counsellors</div>
            <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Status</div>
          </div>
          {schools.map(s => (
            <div key={s.id} className="grid grid-cols-[2fr_1fr_80px_1fr_1fr_80px] px-4 py-3 border-b border-cream-mid last:border-b-0 items-center hover:bg-cream/50 cursor-pointer">
              <div className="text-sm font-medium text-navy">{s.name}</div>
              <div className="text-xs text-slate-400">{[s.city, s.country].filter(Boolean).join(", ") || "—"}</div>
              <span className={`text-[0.62rem] font-medium px-1.5 py-0.5 rounded-full w-fit ${TIER_STYLES[s.tier] ?? ""}`}>{s.tier}</span>
              <div className="text-xs text-navy">{s.studentCount} / {s.maxStudents}</div>
              <div className="text-xs text-navy">{s.counsellorCount} / {s.maxCounsellors}</div>
              <span className={`text-[0.62rem] font-medium px-1.5 py-0.5 rounded-full w-fit ${STATUS_STYLES[s.status] ?? ""}`}>{s.status}</span>
            </div>
          ))}
          {schools.length === 0 && <div className="text-center py-8 text-sm text-slate-300">No schools yet</div>}
        </div>
      </div>
    </>
  );
}
