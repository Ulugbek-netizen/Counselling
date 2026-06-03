import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { getStudentList } from "@/lib/queries/student-list";
import type { UserRole } from "@/types/database";
import { StudentsTable } from "./students-table";

export default async function MyStudentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data } = await supabase
    .from("profiles")
    .select("role, school_id")
    .eq("id", user.id)
    .single();

  const profile = data as { role: UserRole; school_id: string | null } | null;
  if (!profile?.school_id) redirect("/");

  const students = await getStudentList(supabase as any, profile.school_id);

  return (
    <>
      <Topbar
        title="My Students"
        actions={
          <button className="px-3 py-1.5 rounded-lg bg-navy text-white text-xs font-medium hover:bg-navy-mid transition-colors">
            + Add student
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <StudentsTable students={students} />
      </div>
    </>
  );
}
