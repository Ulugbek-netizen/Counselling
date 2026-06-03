import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { StatCard } from "@/components/dashboard/stat-card";
import { StudentNotificationPanel } from "@/components/dashboard/student-notifications";
import { ApplicationTimeline } from "@/components/dashboard/application-timeline";
import { getStudentStats, getStudentNotifications, getBookmarkedUniversities } from "@/lib/queries/student-dashboard";
import { getTimelineData } from "@/lib/queries/student-timeline";
import type { UserRole } from "@/types/database";

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data } = await supabase.from("profiles").select("role, first_name").eq("id", user.id).single();
  const profile = data as { role: UserRole; first_name: string | null } | null;
  if (!profile || profile.role !== "student") redirect("/");

  const s = supabase as any;
  const [stats, notifs, timeline, bookmarks] = await Promise.all([
    getStudentStats(s, user.id),
    getStudentNotifications(s, user.id),
    getTimelineData(s, user.id),
    getBookmarkedUniversities(s, user.id),
  ]);

  return (
    <>
      <Topbar title="Dashboard" subtitle={profile.first_name ? `Welcome back, ${profile.first_name}` : undefined} />

      <div className="flex-1 overflow-y-auto p-6">
        {/* 5 stat cards */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          <StatCard label="Universities on my list" value={stats.universitiesOnList} />
          <StatCard label="Applications submitted" value={stats.applicationsSubmitted} accentColor="#1A7F6E" />
          <StatCard label="Essays in progress" value={stats.essaysInProgress} accentColor="#C9933A" />
          <StatCard
            label="Days to next deadline"
            value={stats.daysToNextDeadline ?? "—"}
            accentColor={stats.daysToNextDeadline && stats.daysToNextDeadline <= 7 ? "#C0392B" : "#2E4F8A"}
          />
          <StatCard
            label="Next meeting"
            value={stats.nextMeeting ?? "None"}
            subtitle="With counsellor"
          />
        </div>

        {/* Notification panel */}
        <div className="mb-6">
          <StudentNotificationPanel data={notifs} />
        </div>

        {/* Timeline and university list */}
        <div className="grid grid-cols-2 gap-4">
          <ApplicationTimeline rows={timeline.rows} exams={timeline.exams} currentMonth={timeline.currentMonth} />

          <div className="bg-white border border-cream-mid rounded-card overflow-hidden">
            <div className="px-4 py-3 border-b border-cream-mid flex items-center justify-between">
              <div className="font-serif text-sm text-navy">My university list</div>
              <a href="/student/universities" className="text-[0.68rem] text-slate-400 hover:text-navy transition-colors">View all</a>
            </div>
            {bookmarks.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-slate-300">
                No universities saved yet
              </div>
            ) : (
              <ul className="divide-y divide-cream-mid">
                {bookmarks.map((b) => {
                  const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
                    considering: { bg: "bg-gray-100", text: "text-slate-500", label: "Considering" },
                    active:      { bg: "bg-amber-50", text: "text-status-amber", label: "In progress" },
                    submitted:   { bg: "bg-emerald-50", text: "text-status-green", label: "Submitted" },
                    accepted:    { bg: "bg-emerald-50", text: "text-status-green", label: "Accepted" },
                    rejected:    { bg: "bg-red-50", text: "text-status-red", label: "Rejected" },
                    waitlisted:  { bg: "bg-blue-50", text: "text-status-blue", label: "Waitlisted" },
                  };
                  const style = STATUS_STYLES[b.status] ?? STATUS_STYLES.considering;
                  const FLAG_MAP: Record<string, string> = { US:"🇺🇸",UK:"🇬🇧",CA:"🇨🇦",AU:"🇦🇺",SG:"🇸🇬",CH:"🇨🇭",DE:"🇩🇪",FR:"🇫🇷",JP:"🇯🇵",KR:"🇰🇷",NL:"🇳🇱" };
                  const flag = FLAG_MAP[b.country] ?? "🏫";
                  return (
                    <li key={b.id} className="flex items-center gap-3 px-4 py-2.5">
                      <span className="text-base flex-shrink-0">{flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[0.78rem] font-medium text-navy truncate">{b.name}</div>
                        <div className="text-[0.65rem] text-slate-400">{b.city}{b.city && b.country ? ", " : ""}{b.country}</div>
                      </div>
                      <span className={`text-[0.62rem] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ${style.bg} ${style.text}`}>{style.label}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
