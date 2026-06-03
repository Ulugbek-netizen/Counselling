import type { SupabaseClient } from "@supabase/supabase-js";
import type { PriorityStudent } from "@/components/dashboard/priority-students";
import type { UrgentDeadline } from "@/components/dashboard/urgent-deadlines";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Client = SupabaseClient<any, any, any>;

const AVATAR_COLORS = ["#C9933A", "#2563EB", "#6D28D9", "#1A7F6E", "#C0392B", "#B7770D", "#0E6FA8"];

export async function getPriorityStudents(supabase: Client, schoolId: string): Promise<PriorityStudent[]> {
  const { data: students } = await supabase
    .from("profiles")
    .select("id, first_name, last_name")
    .eq("school_id", schoolId)
    .eq("role", "student");

  if (!students || students.length === 0) return [];

  const { data: sessions } = await supabase
    .from("sessions")
    .select("student_id, scheduled_at")
    .eq("status", "approved")
    .order("scheduled_at", { ascending: false });

  const lastSessionMap = new Map<string, string>();
  if (sessions) {
    for (const s of sessions) {
      if (!lastSessionMap.has(s.student_id)) {
        lastSessionMap.set(s.student_id, s.scheduled_at);
      }
    }
  }

  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const priority: PriorityStudent[] = [];

  for (const student of students) {
    const lastSession = lastSessionMap.get(student.id);
    const daysSince = lastSession
      ? Math.floor((now.getTime() - new Date(lastSession).getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    if (daysSince < 30) continue;

    const initials = [student.first_name?.[0], student.last_name?.[0]].filter(Boolean).join("").toUpperCase();
    const tags: PriorityStudent["tags"] = [];

    if (daysSince >= 30) tags.push({ label: daysSince >= 45 ? "Overdue" : "No recent session", type: daysSince >= 45 ? "red" : "amber" });

    priority.push({
      id: student.id,
      initials,
      name: `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim(),
      meta: lastSession ? `Last meeting: ${daysSince} days ago` : "No meetings yet",
      color: AVATAR_COLORS[priority.length % AVATAR_COLORS.length],
      tags,
    });
  }

  return priority.sort((a, b) => {
    const aOverdue = a.tags.some(t => t.label === "Overdue");
    const bOverdue = b.tags.some(t => t.label === "Overdue");
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    return 0;
  }).slice(0, 10);
}

export async function getUrgentDeadlines(supabase: Client): Promise<UrgentDeadline[]> {
  const todayStr = new Date().toISOString().split("T")[0];
  const thirtyDays = new Date();
  thirtyDays.setDate(thirtyDays.getDate() + 30);

  const { data } = await supabase
    .from("applications")
    .select("id, deadline_date, student_id, university_id")
    .gte("deadline_date", todayStr)
    .lte("deadline_date", thirtyDays.toISOString().split("T")[0])
    .in("status", ["active", "submitted"])
    .order("deadline_date", { ascending: true })
    .limit(10);

  if (!data) return [];

  const deadlines: UrgentDeadline[] = [];

  for (const app of data) {
    const daysLeft = Math.ceil(
      (new Date(app.deadline_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    const { data: student } = await supabase.from("profiles").select("first_name, last_name").eq("id", app.student_id).single();
    const { data: uni } = await supabase.from("universities").select("name").eq("id", app.university_id).single();

    deadlines.push({
      id: app.id,
      university: uni?.name ?? "University",
      studentName: student ? `${student.first_name} ${student.last_name}` : "Student",
      daysLeft,
      urgency: daysLeft <= 7 ? "critical" : daysLeft <= 30 ? "soon" : "ok",
    });
  }

  return deadlines;
}
