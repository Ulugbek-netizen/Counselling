"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { getRedirectPath } from "@/lib/utils/auth";
import type { UserRole } from "@/types/database";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      setError(authError?.message ?? "Sign-in failed");
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single();
    const profile = data as { role: UserRole } | null;

    if (profile) {
      router.push(getRedirectPath(profile.role));
    } else {
      router.push("/");
    }
  }

  async function handleGoogleSignIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: branding */}
      <div className="hidden lg:flex flex-1 bg-navy flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute top-[-160px] right-[-160px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(201,147,58,0.07)_0%,transparent_65%)]" />
        <div className="absolute bottom-[-120px] left-[-80px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(46,79,138,0.25)_0%,transparent_65%)]" />

        <div className="relative z-10">
          <h1 className="font-serif text-3xl text-white">
            Edu<span className="text-gold">Path</span>
          </h1>
          <p className="text-white/30 text-sm mt-1">College Counselling Platform</p>
        </div>

        <div className="relative z-10">
          <h2 className="font-serif text-2xl text-white leading-tight mb-4">
            Every student&apos;s<br />
            <em className="text-gold">journey,</em> guided<br />
            from one place
          </h2>
          <p className="text-white/40 text-sm max-w-md leading-relaxed">
            One workspace for students and counsellors — tracking applications,
            deadlines, essays, programs, and every milestone.
          </p>
        </div>

        <div className="relative z-10 flex gap-8 pt-6 border-t border-white/10">
          <div>
            <div className="font-serif text-xl text-white">1,200+</div>
            <div className="text-xs text-white/30 mt-0.5">Universities</div>
          </div>
          <div>
            <div className="font-serif text-xl text-white">60+</div>
            <div className="text-xs text-white/30 mt-0.5">Programs</div>
          </div>
          <div>
            <div className="font-serif text-xl text-white">4</div>
            <div className="text-xs text-white/30 mt-0.5">Roles</div>
          </div>
        </div>
      </div>

      {/* Right: sign-in form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-cream">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <h1 className="font-serif text-2xl text-navy text-center">
              Edu<span className="text-gold">Path</span>
            </h1>
          </div>

          <h2 className="font-serif text-xl text-navy mb-1">Welcome back</h2>
          <p className="text-sm text-slate-400 mb-6">Sign in to your account to continue.</p>

          <form onSubmit={handleSignIn} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">School email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
                required
                className="w-full px-3 py-2.5 bg-white border border-cream-mid rounded-[10px] text-sm text-navy outline-none focus:border-navy transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2.5 bg-white border border-cream-mid rounded-[10px] text-sm text-navy outline-none focus:border-navy transition-colors"
              />
            </div>

            <div className="flex justify-end">
              <Link href="/reset-password" className="text-xs text-slate-400 hover:text-navy transition-colors">
                Forgot password?
              </Link>
            </div>

            {error && <p className="text-sm text-status-red">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-navy text-white rounded-[10px] font-medium text-sm hover:bg-navy-mid transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-cream-mid" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-cream-mid" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 bg-white border border-cream-mid rounded-[10px] text-sm font-medium text-navy hover:border-slate-300 transition-colors flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-xs text-slate-400 mt-4">
            No account? <Link href="/request-access" className="text-navy font-medium hover:underline">Request access from your school</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
