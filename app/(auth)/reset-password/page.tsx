"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-full max-w-sm text-center">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-status-green text-xl">✓</span>
          </div>
          <h2 className="font-serif text-xl text-navy mb-2">Check your email</h2>
          <p className="text-sm text-slate-400 mb-6">
            We sent a password reset link to <strong className="text-navy">{email}</strong>
          </p>
          <Link href="/sign-in" className="text-sm text-navy font-medium hover:underline">
            ← Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="w-full max-w-sm">
        <h2 className="font-serif text-xl text-navy mb-1">Reset password</h2>
        <p className="text-sm text-slate-400 mb-6">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        <form onSubmit={handleReset} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu"
              required
              className="w-full px-3 py-2.5 bg-white border border-cream-mid rounded-[10px] text-sm text-navy outline-none focus:border-navy transition-colors"
            />
          </div>

          {error && <p className="text-sm text-status-red">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-navy text-white rounded-[10px] font-medium text-sm hover:bg-navy-mid transition-colors disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-4">
          <Link href="/sign-in" className="text-navy font-medium hover:underline">← Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
