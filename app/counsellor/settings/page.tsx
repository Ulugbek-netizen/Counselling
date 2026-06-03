import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import type { UserRole } from "@/types/database";
import { SettingsForm } from "./settings-form";

export default async function CounsellorSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const profile = data as any;
  if (!profile || !["counsellor", "school_admin"].includes(profile.role)) redirect("/");

  return (
    <>
      <Topbar title="Settings" />
      <div className="flex-1 overflow-y-auto p-6">
        <SettingsForm profile={profile} userEmail={user.email ?? ""} />
      </div>
    </>
  );
}
