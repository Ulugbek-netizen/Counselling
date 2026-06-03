import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { ChatInterface } from "@/components/dashboard/chat-interface";
import type { UserRole } from "@/types/database";

export default async function StudentChatPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data } = await supabase.from("profiles").select("role, school_id").eq("id", user.id).single();
  const profile = data as { role: UserRole; school_id: string | null } | null;
  if (!profile || profile.role !== "student" || !profile.school_id) redirect("/");

  return (
    <>
      <Topbar title="Chat" />
      <ChatInterface userId={user.id} userRole="student" schoolId={profile.school_id} />
    </>
  );
}
