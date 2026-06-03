"use client";

import { signOut } from "@/app/actions/sign-out";

export function SignOutButton({ className }: { className?: string }) {
  return (
    <button
      onClick={() => signOut()}
      className={className ?? "text-sm text-slate-400 hover:text-navy transition-colors"}
    >
      Sign out
    </button>
  );
}
