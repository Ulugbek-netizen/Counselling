"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function StudentSettingsForm() {
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSaved, setPwSaved] = useState(false);

  const inputClass = "w-full px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy bg-white outline-none focus:border-navy transition-colors";

  async function handleChangePassword() {
    setPwError(null);
    if (newPw !== confirmPw) { setPwError("Passwords do not match"); return; }
    if (newPw.length < 8) { setPwError("Minimum 8 characters"); return; }
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPw });
    if (error) { setPwError(error.message); return; }
    setPwSaved(true);
    setNewPw(""); setConfirmPw("");
    setTimeout(() => setPwSaved(false), 3000);
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Password */}
      <div className="bg-white border border-cream-mid rounded-card p-6">
        <h3 className="font-serif text-lg text-navy mb-1">Change password</h3>
        <p className="text-xs text-slate-400 mb-4">Update your account password.</p>
        <div className="space-y-3 max-w-sm">
          <div><label className="block text-xs font-medium text-slate-500 mb-1">New password</label><input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className={inputClass} placeholder="••••••••" /></div>
          <div><label className="block text-xs font-medium text-slate-500 mb-1">Confirm password</label><input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className={inputClass} placeholder="••••••••" /></div>
          {pwError && <p className="text-sm text-status-red">{pwError}</p>}
          <button onClick={handleChangePassword} className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-mid transition-colors">
            {pwSaved ? "✓ Updated" : "Update password"}
          </button>
        </div>
      </div>

      {/* Notification preferences */}
      <div className="bg-white border border-cream-mid rounded-card p-6">
        <h3 className="font-serif text-lg text-navy mb-1">Notifications</h3>
        <p className="text-xs text-slate-400 mb-4">Choose which notifications you receive.</p>
        <div className="space-y-2">
          {[
            "Deadline reminders",
            "Session confirmations",
            "Essay feedback notifications",
            "Scholarship recommendations",
            "Program recommendations",
          ].map((label) => (
            <label key={label} className="flex items-center gap-2.5 text-sm text-navy">
              <input type="checkbox" defaultChecked className="accent-navy" />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="bg-cream-mid/50 rounded-card p-4">
        <p className="text-xs text-slate-400">
          To update your name, birthday, or profile photo, please contact your counsellor — these fields are managed by your school.
        </p>
      </div>
    </div>
  );
}
