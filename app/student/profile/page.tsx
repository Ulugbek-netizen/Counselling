import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import type { UserRole } from "@/types/database";
import { ProfileView } from "./profile-view";

export default async function StudentProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const profile = profileData as any;
  if (!profile || profile.role !== "student") redirect("/");

  const { data: exams } = await (supabase as any).from("student_exams").select("*").eq("student_id", user.id).order("exam_date", { ascending: true });

  return (
    <>
      <Topbar title="My Profile" />
      <div className="flex-1 overflow-y-auto p-6">
        <ProfileView profile={profile} exams={exams ?? []} />
      </div>
    </>
  );
}
