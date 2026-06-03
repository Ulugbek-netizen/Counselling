import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import type { UserRole } from "@/types/database";
import { StudentSettingsForm } from "./settings-form";

export default async function StudentSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const profile = data as { role: UserRole } | null;
  if (!profile || profile.role !== "student") redirect("/");

  return (
    <>
      <Topbar title="Settings" />
      <div className="flex-1 overflow-y-auto p-6">
        <StudentSettingsForm />
      </div>
    </>
  );
}
