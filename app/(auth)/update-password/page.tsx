"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/sign-in?message=password_updated");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="w-full max-w-sm">
        <h2 className="font-serif text-xl text-navy mb-1">Set new password</h2>
        <p className="text-sm text-slate-400 mb-6">Enter your new password below.</p>

        <form onSubmit={handleUpdate} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">New password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              className="w-full px-3 py-2.5 bg-white border border-cream-mid rounded-[10px] text-sm text-navy outline-none focus:border-navy transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
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
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
