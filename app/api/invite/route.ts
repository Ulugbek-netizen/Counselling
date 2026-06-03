import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { email, role, schoolId } = body as { email: string; role: string; schoolId: string };

  if (!email || !role || !schoolId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const s = supabase as any;
  // Verify inviter has permission
  const { data: profile } = await s.from("profiles").select("role, school_id").eq("id", user.id).single();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 403 });

  // Platform admin can invite school_admin
  // School admin can invite counsellor and student
  // Counsellor can invite student
  const canInvite =
    profile.role === "platform_admin" ||
    (profile.role === "school_admin" && ["counsellor", "student"].includes(role)) ||
    (profile.role === "counsellor" && role === "student");

  if (!canInvite) return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { error } = await s.from("invitations").insert({
    school_id: schoolId, email, role, invited_by: user.id,
    token, status: "sent", expires_at: expiresAt.toISOString(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // In production, send email via Resend here
  const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/accept-invite?token=${token}`;

  return NextResponse.json({ success: true, inviteLink });
}
