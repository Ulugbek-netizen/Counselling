import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types/database";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data } = await supabase.from("profiles").select("role, first_name, last_name").eq("id", user.id).single();
  const profile = data as { role: UserRole; first_name: string | null; last_name: string | null } | null;
  if (!profile || profile.role !== "platform_admin") redirect("/");

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      <aside className="w-[220px] flex-shrink-0 bg-navy flex flex-col h-screen">
        <div className="px-5 pt-5 pb-3 border-b border-white/[0.07]">
          <div className="font-serif text-lg text-white">Edu<span className="text-gold">Path</span></div>
          <div className="text-[0.68rem] text-white/30 mt-0.5">Platform Admin</div>
        </div>
        <nav className="flex-1 py-3 px-3 space-y-0.5">
          {[
            { href: "/admin", label: "Dashboard", icon: "⊞" },
            { href: "/admin/schools", label: "Schools", icon: "🏫" },
            { href: "/admin/universities", label: "Universities", icon: "🎓" },
            { href: "/admin/scholarships", label: "Scholarships", icon: "🏅" },
            { href: "/admin/programs", label: "Programs", icon: "🔬" },
            { href: "/admin/requests", label: "Pending Requests", icon: "📩" },
            { href: "/admin/settings", label: "Settings", icon: "⚙️" },
          ].map(l => (
            <Link key={l.href} href={l.href} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[0.82rem] text-white/50 hover:bg-white/[0.06] hover:text-white/80 transition-colors">
              <span className="text-sm w-[18px] text-center">{l.icon}</span>{l.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-3 border-t border-white/[0.07]">
          <div className="text-sm text-white font-medium">{profile.first_name} {profile.last_name}</div>
          <div className="text-[0.68rem] text-white/35">Platform Admin</div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">{children}</main>
    </div>
  );
}
