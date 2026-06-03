import type { SupabaseClient } from "@supabase/supabase-js";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Client = SupabaseClient<any, any, any>;

export interface StudentRow {
  id: string;
  initials: string;
  name: string;
  grade: string;
  color: string;
  universities: string;
  lastSession: string;
  nextDeadline: { days: number; label: string } | null;
  progressPercent: number;
  status: "priority" | "active" | "on_track" | "early_stage";
}

const COLORS = ["#C9933A", "#2563EB", "#6D28D9", "#1A7F6E", "#C0392B", "#B7770D", "#0E6FA8"];

export async function getStudentList(supabase: Client, schoolId: string): Promise<StudentRow[]> {
  const { data: students } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, grade")
    .eq("school_id", schoolId)
    .eq("role", "student")
    .order("last_name", { ascending: true });

  if (!students) return [];

  const rows: StudentRow[] = [];

  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    const initials = [s.first_name?.[0], s.last_name?.[0]].filter(Boolean).join("").toUpperCase();

    // Get universities
    const { data: bookmarks } = await supabase
      .from("university_bookmarks")
      .select("university_id, universities(name)")
      .eq("student_id", s.id)
      .in("status", ["considering", "active"]);

    const uniNames = bookmarks?.map((b: any) => b.universities?.name).filter(Boolean).slice(0, 3) ?? [];
    const uniStr = uniNames.length > 0 ? uniNames.join(", ") : "No universities yet";

    // Get last session
    const { data: lastSess } = await supabase
      .from("sessions")
      .select("scheduled_at")
      .eq("student_id", s.id)
      .eq("status", "approved")
      .order("scheduled_at", { ascending: false })
      .limit(1);

    let lastSessionStr = "No sessions";
    let daysSinceSession = 999;
    if (lastSess?.[0]?.scheduled_at) {
      daysSinceSession = Math.floor((Date.now() - new Date(lastSess[0].scheduled_at).getTime()) / (1000 * 60 * 60 * 24));
      lastSessionStr = daysSinceSession === 0 ? "Today" : `${daysSinceSession} days ago`;
    }

    // Get next deadline
    const todayStr = new Date().toISOString().split("T")[0];
    const { data: nextDl } = await supabase
      .from("applications")
      .select("deadline_date")
      .eq("student_id", s.id)
      .gte("deadline_date", todayStr)
      .in("status", ["active", "submitted"])
      .order("deadline_date", { ascending: true })
      .limit(1);

    let nextDeadline: StudentRow["nextDeadline"] = null;
    if (nextDl?.[0]?.deadline_date) {
      const days = Math.ceil((new Date(nextDl[0].deadline_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      nextDeadline = { days, label: `${days} days` };
    }

    // Get progress (count of applications with progress)
    const { data: apps } = await supabase
      .from("applications")
      .select("progress_percent")
      .eq("student_id", s.id)
      .in("status", ["active", "submitted"]);

    const avgProgress = apps && apps.length > 0
      ? Math.round(apps.reduce((sum: number, a: any) => sum + (a.progress_percent ?? 0), 0) / apps.length)
      : 0;

    // Determine status
    let status: StudentRow["status"] = "early_stage";
    if (daysSinceSession >= 30 || (nextDeadline && nextDeadline.days <= 7)) {
      status = "priority";
    } else if (apps && apps.length > 0) {
      status = avgProgress >= 70 ? "on_track" : "active";
    }

    rows.push({
      id: s.id,
      initials,
      name: `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim(),
      grade: s.grade ?? "—",
      color: COLORS[i % COLORS.length],
      universities: uniStr,
      lastSession: lastSessionStr,
      nextDeadline,
      progressPercent: avgProgress,
      status,
    });
  }

  return rows;
}
