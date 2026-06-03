import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CounsellorSidebar } from "@/components/layout/counsellor-sidebar";
import type { UserRole } from "@/types/database";

export default async function CounsellorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data } = await supabase
    .from("profiles")
    .select("first_name, last_name, role, avatar_url")
    .eq("id", user.id)
    .single();

  const profile = data as { first_name: string | null; last_name: string | null; role: UserRole; avatar_url: string | null } | null;
  if (!profile || !["counsellor", "school_admin"].includes(profile.role)) {
    redirect("/");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      <CounsellorSidebar profile={profile} />
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {children}
      </main>
    </div>
  );
}
