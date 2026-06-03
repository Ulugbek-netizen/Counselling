import type { SupabaseClient } from "@supabase/supabase-js";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Client = SupabaseClient<any, any, any>;

export interface DashboardStats {
  totalStudents: number;
  activeApplications: number;
  priorityStudents: number;
  deadlinesThisMonth: number;
}

export interface BannerEvent {
  id: string;
  label: string;
  color: string;
}

export async function getDashboardStats(supabase: Client, schoolId: string): Promise<DashboardStats> {
  const [studentsResult, applicationsResult, deadlinesResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("school_id", schoolId)
      .eq("role", "student"),

    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .in("status", ["active", "submitted"]),

    supabase
      .from("applications")
      .select("id")
      .not("deadline_date", "is", null)
      .gte("deadline_date", new Date().toISOString().split("T")[0])
      .lte("deadline_date", getDatePlusDays(30)),
  ]);

  // Priority students: no session in 30+ days
  const { data: allStudents } = await supabase
    .from("profiles")
    .select("id")
    .eq("school_id", schoolId)
    .eq("role", "student");

  const { data: recentSessions } = await supabase
    .from("sessions")
    .select("student_id, scheduled_at")
    .order("scheduled_at", { ascending: false });

  const studentLastSession = new Map<string, string>();
  if (recentSessions) {
    for (const s of recentSessions) {
      if (!studentLastSession.has(s.student_id)) {
        studentLastSession.set(s.student_id, s.scheduled_at ?? "");
      }
    }
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  let priorityCount = 0;

  if (allStudents) {
    for (const student of allStudents) {
      const last = studentLastSession.get(student.id);
      if (!last || new Date(last) < thirtyDaysAgo) {
        priorityCount++;
      }
    }
  }

  return {
    totalStudents: studentsResult.count ?? 0,
    activeApplications: applicationsResult.count ?? 0,
    priorityStudents: priorityCount,
    deadlinesThisMonth: deadlinesResult.data?.length ?? 0,
  };
}

export async function getThisWeekEvents(supabase: Client, schoolId: string): Promise<BannerEvent[]> {
  const now = new Date();
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + (7 - now.getDay()));

  const startStr = now.toISOString().split("T")[0];
  const endStr = endOfWeek.toISOString().split("T")[0];

  const events: BannerEvent[] = [];

  // Deadlines this week
  const { data: deadlines } = await supabase
    .from("applications")
    .select("id, deadline_date")
    .gte("deadline_date", startStr)
    .lte("deadline_date", endStr)
    .in("status", ["active", "submitted"]);

  if (deadlines) {
    for (const d of deadlines) {
      events.push({ id: `dl-${d.id}`, label: `Deadline — ${d.deadline_date}`, color: "#E74C3C" });
    }
  }

  // Sessions this week
  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, scheduled_at")
    .gte("scheduled_at", now.toISOString())
    .lte("scheduled_at", endOfWeek.toISOString())
    .eq("status", "approved");

  if (sessions) {
    for (const s of sessions) {
      events.push({ id: `sess-${s.id}`, label: "Session scheduled", color: "#E8B86D" });
    }
  }

  // Birthdays this week
  const { data: students } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, birthday")
    .eq("school_id", schoolId)
    .eq("role", "student")
    .not("birthday", "is", null);

  if (students) {
    for (const s of students) {
      if (s.birthday) {
        const bday = new Date(s.birthday);
        const thisYear = new Date(now.getFullYear(), bday.getMonth(), bday.getDate());
        if (thisYear >= now && thisYear <= endOfWeek) {
          events.push({ id: `bday-${s.id}`, label: `🎂 ${s.first_name} ${s.last_name}`, color: "#1A7F6E" });
        }
      }
    }
  }

  // Exams this week
  const { data: exams } = await supabase
    .from("student_exams")
    .select("id, exam_name, exam_date")
    .gte("exam_date", startStr)
    .lte("exam_date", endStr)
    .eq("status", "planned");

  if (exams) {
    for (const e of exams) {
      events.push({ id: `exam-${e.id}`, label: `${e.exam_name} — ${e.exam_date}`, color: "#6D28D9" });
    }
  }

  return events;
}

export interface BirthdayReminder {
  id: string;
  name: string;
  ageTurning: number;
  daysUntil: number;
  birthdayDate: string;
}

export async function getBirthdayStudents(supabase: Client, schoolId: string): Promise<BirthdayReminder[]> {
  const { data: students } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, birthday")
    .eq("school_id", schoolId)
    .eq("role", "student")
    .not("birthday", "is", null);

  if (!students?.length) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in7Days = new Date(today);
  in7Days.setDate(today.getDate() + 7);

  const results: BirthdayReminder[] = [];

  for (const s of students) {
    if (!s.birthday) continue;
    const bday = new Date(s.birthday);

    let next = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
    if (next < today) next = new Date(today.getFullYear() + 1, bday.getMonth(), bday.getDate());
    if (next > in7Days) continue;

    const daysUntil = Math.round((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    results.push({
      id: s.id,
      name: `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim(),
      ageTurning: next.getFullYear() - bday.getFullYear(),
      daysUntil,
      birthdayDate: next.toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
    });
  }

  return results.sort((a, b) => a.daysUntil - b.daysUntil);
}

function getDatePlusDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}
