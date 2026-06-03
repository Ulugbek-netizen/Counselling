import type { SupabaseClient } from "@supabase/supabase-js";
import type { StudentNotifData, NotifItem } from "@/components/dashboard/student-notifications";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Client = SupabaseClient<any, any, any>;

export interface StudentStats {
  universitiesOnList: number;
  applicationsSubmitted: number;
  essaysInProgress: number;
  daysToNextDeadline: number | null;
  nextMeeting: string | null;
}

export interface BookmarkedUniversity {
  id: string;
  universityId: string;
  name: string;
  country: string;
  city: string;
  status: string;
}

export async function getBookmarkedUniversities(supabase: Client, userId: string): Promise<BookmarkedUniversity[]> {
  const { data } = await supabase
    .from("university_bookmarks")
    .select("id, university_id, status, universities(name, country, city)")
    .eq("student_id", userId)
    .order("created_at", { ascending: false })
    .limit(8);

  return (data ?? []).map((b: any) => ({
    id: b.id,
    universityId: b.university_id,
    name: b.universities?.name ?? "University",
    country: b.universities?.country ?? "",
    city: b.universities?.city ?? "",
    status: b.status,
  }));
}

export async function getStudentStats(supabase: Client, userId: string): Promise<StudentStats> {
  const todayStr = new Date().toISOString().split("T")[0];

  const [bookmarks, submitted, essays, deadline, meeting] = await Promise.all([
    supabase.from("university_bookmarks").select("id", { count: "exact", head: true }).eq("student_id", userId),
    supabase.from("applications").select("id", { count: "exact", head: true }).eq("student_id", userId).eq("status", "submitted"),
    supabase.from("essays").select("id", { count: "exact", head: true }).eq("student_id", userId).in("status", ["draft", "submitted_for_review"]),
    supabase.from("applications").select("deadline_date").eq("student_id", userId).gte("deadline_date", todayStr).in("status", ["active", "submitted"]).order("deadline_date", { ascending: true }).limit(1),
    supabase.from("sessions").select("scheduled_at").eq("student_id", userId).eq("status", "approved").gte("scheduled_at", new Date().toISOString()).order("scheduled_at", { ascending: true }).limit(1),
  ]);

  let daysToNext: number | null = null;
  if (deadline.data?.[0]?.deadline_date) {
    daysToNext = Math.ceil((new Date(deadline.data[0].deadline_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  }

  let nextMeeting: string | null = null;
  if (meeting.data?.[0]?.scheduled_at) {
    const d = new Date(meeting.data[0].scheduled_at);
    nextMeeting = d.toLocaleDateString("en-GB", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  return {
    universitiesOnList: bookmarks.count ?? 0,
    applicationsSubmitted: submitted.count ?? 0,
    essaysInProgress: essays.count ?? 0,
    daysToNextDeadline: daysToNext,
    nextMeeting,
  };
}

export async function getStudentNotifications(supabase: Client, userId: string): Promise<StudentNotifData> {
  const todayStr = new Date().toISOString().split("T")[0];

  // Application deadlines
  const { data: apps } = await supabase
    .from("applications")
    .select("id, deadline_date, university_id, universities(name)")
    .eq("student_id", userId)
    .gte("deadline_date", todayStr)
    .in("status", ["active", "submitted"])
    .order("deadline_date", { ascending: true });

  const deadlines: NotifItem[] = (apps ?? []).map((a: any) => {
    const days = Math.ceil((new Date(a.deadline_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return {
      id: `dl-${a.id}`,
      title: a.universities?.name ?? "University",
      subtitle: a.deadline_date,
      daysLeft: days,
      urgency: days <= 7 ? "urgent" as const : days <= 30 ? "soon" as const : "ok" as const,
    };
  });

  // Scholarship deadlines
  const { data: schols } = await supabase
    .from("scholarship_bookmarks")
    .select("id, scholarship_id, scholarships(name, deadline)")
    .eq("student_id", userId);

  const scholarships: NotifItem[] = (schols ?? [])
    .filter((s: any) => s.scholarships?.deadline && s.scholarships.deadline >= todayStr)
    .map((s: any) => {
      const days = Math.ceil((new Date(s.scholarships.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return {
        id: `sch-${s.id}`,
        title: s.scholarships.name,
        subtitle: s.scholarships.deadline,
        daysLeft: days,
        urgency: days <= 7 ? "urgent" as const : days <= 30 ? "soon" as const : "ok" as const,
      };
    })
    .sort((a: NotifItem, b: NotifItem) => a.daysLeft - b.daysLeft);

  // Exams
  const { data: exams } = await supabase
    .from("student_exams")
    .select("id, exam_name, exam_date")
    .eq("student_id", userId)
    .eq("status", "planned")
    .gte("exam_date", todayStr)
    .order("exam_date", { ascending: true });

  const examItems: NotifItem[] = (exams ?? []).map((e: any) => {
    const days = Math.ceil((new Date(e.exam_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return {
      id: `ex-${e.id}`,
      title: e.exam_name,
      subtitle: e.exam_date,
      daysLeft: days,
      urgency: days <= 7 ? "urgent" as const : days <= 30 ? "soon" as const : "ok" as const,
    };
  });

  return { deadlines, scholarships, exams: examItems };
}
