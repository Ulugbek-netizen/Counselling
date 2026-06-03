import type { SupabaseClient } from "@supabase/supabase-js";
import type { CalendarEvent } from "@/components/dashboard/mini-calendar";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Client = SupabaseClient<any, any, any>;

export async function getCalendarEvents(supabase: Client, schoolId: string): Promise<CalendarEvent[]> {
  const events: CalendarEvent[] = [];

  const [deadlines, sessions, students, exams] = await Promise.all([
    supabase
      .from("applications")
      .select("id, deadline_date, university_id, universities(name)")
      .not("deadline_date", "is", null)
      .in("status", ["active", "submitted"]),
    supabase
      .from("sessions")
      .select("id, scheduled_at, student_id, profiles!sessions_student_id_fkey(first_name, last_name)")
      .eq("status", "approved")
      .not("scheduled_at", "is", null),
    supabase
      .from("profiles")
      .select("id, first_name, last_name, birthday")
      .eq("school_id", schoolId)
      .eq("role", "student")
      .not("birthday", "is", null),
    supabase
      .from("student_exams")
      .select("id, exam_name, exam_date, student_id, profiles!student_exams_student_id_fkey(first_name, last_name)")
      .eq("status", "planned")
      .not("exam_date", "is", null),
  ]);

  if (deadlines.data) {
    for (const d of deadlines.data) {
      const uniName = (d as any).universities?.name ?? "University";
      events.push({
        id: `dl-${d.id}`,
        date: d.deadline_date,
        type: "deadline",
        title: `${uniName} deadline`,
        subtitle: d.deadline_date,
      });
    }
  }

  if (sessions.data) {
    for (const s of sessions.data) {
      const profile = (s as any).profiles;
      const name = profile ? `${profile.first_name} ${profile.last_name}` : "Student";
      const date = s.scheduled_at ? s.scheduled_at.split("T")[0] : "";
      events.push({
        id: `sess-${s.id}`,
        date,
        type: "session",
        title: `Session — ${name}`,
        subtitle: s.scheduled_at ? new Date(s.scheduled_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "",
      });
    }
  }

  if (students.data) {
    const now = new Date();
    for (const s of students.data) {
      if (s.birthday) {
        const bday = new Date(s.birthday);
        const thisYear = new Date(now.getFullYear(), bday.getMonth(), bday.getDate());
        const dateStr = thisYear.toISOString().split("T")[0];
        events.push({
          id: `bday-${s.id}`,
          date: dateStr,
          type: "birthday",
          title: `🎂 ${s.first_name} ${s.last_name}`,
          subtitle: "Birthday",
        });
      }
    }
  }

  if (exams.data) {
    for (const e of exams.data) {
      const profile = (e as any).profiles;
      const name = profile ? `${profile.first_name} ${profile.last_name}` : "Student";
      events.push({
        id: `exam-${e.id}`,
        date: e.exam_date,
        type: "exam",
        title: `${e.exam_name} — ${name}`,
        subtitle: e.exam_date,
      });
    }
  }

  return events;
}
