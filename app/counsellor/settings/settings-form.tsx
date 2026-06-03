"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  profile: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    title: string | null;
    department: string | null;
    phone: string | null;
    show_as_counsellor: boolean;
  };
  userEmail: string;
}

export function SettingsForm({ profile, userEmail }: Props) {
  const [title, setTitle] = useState(profile.title ?? "");
  const [department, setDepartment] = useState(profile.department ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [showAsCounsellor, setShowAsCounsellor] = useState(profile.show_as_counsellor);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSaved, setPwSaved] = useState(false);

  const inputClass = "w-full px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy bg-white outline-none focus:border-navy transition-colors";

  async function handleSaveProfile() {
    setSaving(true);
    const supabase = createClient() as any;
    await supabase.from("profiles").update({ title, department, phone, show_as_counsellor: showAsCounsellor }).eq("id", profile.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleChangePassword() {
    setPwError(null);
    if (newPw !== confirmPw) { setPwError("Passwords do not match"); return; }
    if (newPw.length < 8) { setPwError("Minimum 8 characters"); return; }
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPw });
    if (error) { setPwError(error.message); return; }
    setPwSaved(true);
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setTimeout(() => setPwSaved(false), 3000);
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile info */}
      <div className="bg-white border border-cream-mid rounded-card p-6">
        <h3 className="font-serif text-lg text-navy mb-4">Professional info</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div><label className="block text-xs font-medium text-slate-500 mb-1">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className={inputClass} placeholder="Senior Counsellor" /></div>
          <div><label className="block text-xs font-medium text-slate-500 mb-1">Department</label><input value={department} onChange={e => setDepartment(e.target.value)} className={inputClass} placeholder="College Counselling" /></div>
          <div><label className="block text-xs font-medium text-slate-500 mb-1">Phone</label><input value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} placeholder="+1 555 0100" /></div>
          <div><label className="block text-xs font-medium text-slate-500 mb-1">Email</label><input value={userEmail} disabled className={inputClass + " opacity-50"} /></div>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <input type="checkbox" checked={showAsCounsellor} onChange={e => setShowAsCounsellor(e.target.checked)} />
          Show me as available counsellor to students
        </label>
        <button onClick={handleSaveProfile} disabled={saving} className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-mid transition-colors disabled:opacity-50">
          {saving ? "Saving..." : saved ? "✓ Saved" : "Save changes"}
        </button>
      </div>

      {/* Password */}
      <div className="bg-white border border-cream-mid rounded-card p-6">
        <h3 className="font-serif text-lg text-navy mb-4">Change password</h3>
        <div className="space-y-3 max-w-sm">
          <div><label className="block text-xs font-medium text-slate-500 mb-1">New password</label><input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className={inputClass} placeholder="••••••••" /></div>
          <div><label className="block text-xs font-medium text-slate-500 mb-1">Confirm password</label><input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className={inputClass} placeholder="••••••••" /></div>
          {pwError && <p className="text-sm text-status-red">{pwError}</p>}
          <button onClick={handleChangePassword} className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-mid transition-colors">
            {pwSaved ? "✓ Updated" : "Update password"}
          </button>
        </div>
      </div>
    </div>
  );
}
