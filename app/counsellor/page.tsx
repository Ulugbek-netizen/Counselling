import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { StatCard } from "@/components/dashboard/stat-card";
import { NotificationBanner } from "@/components/dashboard/notification-banner";
import { MiniCalendar } from "@/components/dashboard/mini-calendar";
import { PriorityStudentsPanel } from "@/components/dashboard/priority-students";
import { UrgentDeadlinesPanel } from "@/components/dashboard/urgent-deadlines";
import { getDashboardStats, getThisWeekEvents } from "@/lib/queries/counsellor-dashboard";
import { getCalendarEvents } from "@/lib/queries/calendar-events";
import { getPriorityStudents, getUrgentDeadlines } from "@/lib/queries/priority-deadlines";
import type { UserRole } from "@/types/database";

export default async function CounsellorDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data } = await supabase
    .from("profiles")
    .select("role, school_id, first_name")
    .eq("id", user.id)
    .single();

  const profile = data as { role: UserRole; school_id: string | null; first_name: string | null } | null;
  if (!profile?.school_id) redirect("/");

  const s = supabase as any;
  const [stats, weekEvents, calEvents, priorityStudents, urgentDeadlines] = await Promise.all([
    getDashboardStats(s, profile.school_id),
    getThisWeekEvents(s, profile.school_id),
    getCalendarEvents(s, profile.school_id),
    getPriorityStudents(s, profile.school_id),
    getUrgentDeadlines(s),
  ]);

  return (
    <>
      <Topbar
        title="Dashboard"
        actions={
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-cream-mid bg-transparent text-slate-500 text-xs font-medium hover:bg-cream transition-colors">
              + Add student
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-navy text-white text-xs font-medium hover:bg-navy-mid transition-colors">
              + New session
            </button>
          </div>
        }
      />

      <NotificationBanner events={weekEvents} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard label="Total students" value={stats.totalStudents} subtitle="Across all grades" />
          <StatCard label="Active applications" value={stats.activeApplications} accentColor="#C0392B" />
          <StatCard label="Priority students" value={stats.priorityStudents} subtitle="No meeting in 30+ days" accentColor="#C9933A" />
          <StatCard label="Deadlines this month" value={stats.deadlinesThisMonth} accentColor="#2E4F8A" />
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: "2fr 1fr 300px" }}>
          <PriorityStudentsPanel students={priorityStudents} />
          <UrgentDeadlinesPanel deadlines={urgentDeadlines} />
          <MiniCalendar events={calEvents} />
        </div>
      </div>
    </>
  );
}
