import type { SupabaseClient } from "@supabase/supabase-js";
import type { TimelineRow, TimelineExam } from "@/components/dashboard/application-timeline";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Client = SupabaseClient<any, any, any>;

export async function getTimelineData(supabase: Client, userId: string) {
  const { data: apps } = await supabase
    .from("applications")
    .select("id, application_type, status, deadline_date, decision_date, university_id, universities(name)")
    .eq("student_id", userId)
    .in("status", ["active", "submitted", "considering"]);

  const rows: TimelineRow[] = (apps ?? []).map((a: any) => {
    const dlDate = a.deadline_date ? new Date(a.deadline_date) : new Date();
    const decDate = a.decision_date ? new Date(a.decision_date) : null;

    // Convert to academic year month (Sep=0, Oct=1, ... Aug=11)
    const toAcademicMonth = (d: Date) => (d.getMonth() + 4) % 12;

    const deadlineMonth = toAcademicMonth(dlDate);
    const startMonth = Math.max(0, deadlineMonth - 3);
    const decisionMonth = decDate ? toAcademicMonth(decDate) : null;

    const typeLabels: Record<string, string> = {
      ea: "Early Action", ed: "Early Decision", rea: "REA", rd: "Regular", rolling: "Rolling", other: "Other"
    };

    return {
      id: a.id,
      universityName: a.universities?.name ?? "University",
      applicationType: typeLabels[a.application_type ?? "rd"] ?? "Regular",
      status: a.status === "submitted" ? "submitted" : a.status === "considering" ? "considering" : "active",
      startMonth,
      deadlineMonth,
      decisionMonth,
    };
  });

  // Exams
  const { data: exams } = await supabase
    .from("student_exams")
    .select("id, exam_name, exam_date")
    .eq("student_id", userId)
    .eq("status", "planned")
    .not("exam_date", "is", null);

  const examItems: TimelineExam[] = (exams ?? []).map((e: any) => {
    const d = new Date(e.exam_date);
    const month = (d.getMonth() + 4) % 12;
    return { id: e.id, name: e.exam_name, month };
  });

  const now = new Date();
  const currentMonth = (now.getMonth() + 4) % 12;

  return { rows, exams: examItems, currentMonth };
}
