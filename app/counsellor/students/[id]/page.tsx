import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import Link from "next/link";
import type { UserRole } from "@/types/database";
import { StudentDetailTabs } from "./student-detail-tabs";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  // Get counsellor's profile (for school_id check)
  const { data: counsellorData } = await supabase
    .from("profiles")
    .select("role, school_id")
    .eq("id", user.id)
    .single();

  const counsellor = counsellorData as {
    role: UserRole;
    school_id: string | null;
  } | null;

  if (!counsellor?.school_id) redirect("/");

  // Fetch the student profile
  const { data: rawStudent } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, email, phone, birthday, grade, school_id")
    .eq("id", id)
    .maybeSingle();

  type StudentData = {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    birthday: string | null;
    grade: string | null;
    school_id: string | null;
  };

  const studentData = rawStudent as StudentData | null;

  // Security check — student must belong to counsellor's school
  if (!studentData || studentData.school_id !== counsellor.school_id) {
    redirect("/counsellor/students");
  }

  const student = studentData;

  const fullName =
    [student.first_name, student.last_name].filter(Boolean).join(" ") || "Student";

  return (
    <>
      <Topbar
        title={fullName}
        actions={
          <Link
            href="/counsellor/students"
            className="px-3 py-1.5 rounded-lg border border-cream-mid bg-transparent text-slate-500 text-xs font-medium hover:bg-cream transition-colors"
          >
            ← Back to Students
          </Link>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <StudentDetailTabs student={student} />
      </div>
    </>
  );
}
