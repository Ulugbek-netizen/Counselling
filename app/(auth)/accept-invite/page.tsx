"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [invitation, setInvitation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function checkToken() {
      if (!token) { setError("No invitation token"); setLoading(false); return; }
      const supabase = createClient() as any;
      const { data, error: fetchError } = await supabase.from("invitations").select("*").eq("token", token).eq("status", "sent").single();
      if (fetchError || !data) { setError("Invalid or expired invitation"); setLoading(false); return; }
      if (new Date(data.expires_at) < new Date()) { setError("This invitation has expired"); setLoading(false); return; }
      setInvitation(data);
      setLoading(false);
    }
    checkToken();
  }, [token]);

  async function handleCreateAccount() {
    if (password !== confirmPw) { setError("Passwords do not match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setCreating(true); setError(null);

    const supabase = createClient() as any;
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: invitation.email,
      password,
      options: { data: { role: invitation.role } },
    });

    if (signUpError) { setError(signUpError.message); setCreating(false); return; }

    // Update profile with school_id and role
    if (authData.user) {
      await supabase.from("profiles").update({
        school_id: invitation.school_id,
        role: invitation.role,
      }).eq("id", authData.user.id);

      // Mark invitation as accepted
      await supabase.from("invitations").update({ status: "accepted", accepted_at: new Date().toISOString() }).eq("id", invitation.id);
    }

    // Redirect based on role
    const redirectPath = invitation.role === "student" ? "/student" : invitation.role === "platform_admin" ? "/admin" : "/counsellor";
    router.push(redirectPath);
  }

  const inputClass = "w-full px-3 py-2.5 bg-white border border-cream-mid rounded-[10px] text-sm text-navy outline-none focus:border-navy transition-colors";

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream"><div className="text-sm text-slate-400">Checking invitation…</div></div>;

  if (error && !invitation) return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center"><div className="text-3xl mb-3">😞</div><div className="font-serif text-xl text-navy mb-2">Invalid invitation</div><p className="text-sm text-slate-400">{error}</p></div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl text-navy mb-1 text-center">Join Edu<span className="text-gold">Path</span></h1>
        <p className="text-sm text-slate-400 text-center mb-6">Create your account to get started as a <strong className="text-navy">{invitation?.role}</strong>.</p>
        <div className="bg-white border border-cream-mid rounded-card p-5 mb-4">
          <div className="text-xs text-slate-400 mb-1">Invited email</div>
          <div className="text-sm font-medium text-navy">{invitation?.email}</div>
        </div>
        <div className="space-y-3">
          <div><label className="block text-xs font-medium text-slate-500 mb-1">Create password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} /></div>
          <div><label className="block text-xs font-medium text-slate-500 mb-1">Confirm password</label><input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="••••••••" className={inputClass} /></div>
          {error && <p className="text-sm text-status-red">{error}</p>}
          <button onClick={handleCreateAccount} disabled={creating} className="w-full py-2.5 bg-navy text-white rounded-[10px] font-medium text-sm hover:bg-navy-mid transition-colors disabled:opacity-50">
            {creating ? "Creating account…" : "Create account →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-cream"><div className="text-sm text-slate-400">Loading…</div></div>}><AcceptInviteContent /></Suspense>;
}
