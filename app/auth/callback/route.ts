import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getRedirectPath } from "@/lib/utils/auth";
import type { UserRole } from "@/types/database";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // If a specific redirect was requested (e.g. password reset)
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      // Otherwise redirect based on role
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        const profile = data as { role: UserRole } | null;
        if (profile) {
          return NextResponse.redirect(`${origin}${getRedirectPath(profile.role)}`);
        }
      }

      return NextResponse.redirect(`${origin}/`);
    }
  }

  return NextResponse.redirect(`${origin}/sign-in?error=auth_failed`);
}
