import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { StatCard } from "@/components/dashboard/stat-card";
import type { UserRole } from "@/types/database";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || (profile as any).role !== "platform_admin") redirect("/");

  const s = supabase as any;
  const [schools, students, requests] = await Promise.all([
    s.from("schools").select("id", { count: "exact", head: true }),
    s.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
    s.from("access_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  return (
    <>
      <Topbar title="Platform Dashboard" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard label="Active schools" value={schools.count ?? 0} />
          <StatCard label="Total students" value={students.count ?? 0} />
          <StatCard label="Monthly revenue" value="—" subtitle="Connect Stripe" accentColor="#1A7F6E" />
          <StatCard label="Pending requests" value={requests.count ?? 0} accentColor={requests.count > 0 ? "#C0392B" : "#0E1E3D"} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Recent schools */}
          <div className="bg-white border border-cream-mid rounded-card p-6">
            <h3 className="font-serif text-base text-navy mb-4">Schools</h3>
            <SchoolsList />
          </div>
          {/* Recent activity placeholder */}
          <div className="bg-white border border-cream-mid rounded-card p-6">
            <h3 className="font-serif text-base text-navy mb-4">Recent activity</h3>
            <p className="text-sm text-slate-300 text-center py-8">Activity log coming soon</p>
          </div>
        </div>
      </div>
    </>
  );
}

async function SchoolsList() {
  const supabase = await (await import("@/lib/supabase/server")).createClient();
  const { data: schools } = await (supabase as any).from("schools").select("id, name, country, subscription_tier, subscription_status, max_students").order("created_at", { ascending: false }).limit(10);

  const TIER_STYLES: Record<string, string> = { starter: "bg-gray-100 text-slate-500", growth: "bg-blue-50 text-status-blue", professional: "bg-purple-50 text-status-purple", enterprise: "bg-gold/10 text-gold" };

  if (!schools || schools.length === 0) return <p className="text-sm text-slate-300 text-center py-4">No schools yet</p>;

  return (
    <div className="space-y-2">
      {schools.map((s: any) => (
        <div key={s.id} className="flex items-center gap-3 px-3 py-2.5 bg-cream rounded-lg">
          <div className="flex-1">
            <div className="text-sm font-medium text-navy">{s.name}</div>
            <div className="text-xs text-slate-400">{s.country ?? "—"}</div>
          </div>
          <span className={`text-[0.62rem] font-medium px-1.5 py-0.5 rounded-full ${TIER_STYLES[s.subscription_tier] ?? ""}`}>{s.subscription_tier}</span>
        </div>
      ))}
    </div>
  );
}
