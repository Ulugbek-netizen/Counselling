"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/sign-out";
import type { Profile } from "@/types/database";

interface SidebarProps {
  profile: Pick<Profile, "first_name" | "last_name" | "role" | "avatar_url">;
}

const mainLinks = [
  { href: "/counsellor", label: "Dashboard", icon: "⊞" },
  { href: "/counsellor/students", label: "My Students", icon: "👥", badge: true },
  { href: "/counsellor/applications", label: "Applications", icon: "📋" },
  { href: "/counsellor/essays", label: "Essays", icon: "✍️" },
  { href: "/counsellor/sessions", label: "Sessions", icon: "📅" },
  { href: "/counsellor/documents", label: "Documents", icon: "📄" },
];

const exploreLinks = [
  { href: "/counsellor/universities", label: "Universities", icon: "🎓" },
  { href: "/counsellor/programs", label: "Programs & Olympiads", icon: "🔬" },
  { href: "/counsellor/scholarships", label: "Scholarships", icon: "🏅" },
];

const workspaceLinks = [
  { href: "/counsellor/chat", label: "Chat", icon: "💬" },
  { href: "/counsellor/reports", label: "Reports", icon: "📊" },
  { href: "/counsellor/settings", label: "Settings", icon: "⚙️" },
];

export function CounsellorSidebar({ profile }: SidebarProps) {
  const pathname = usePathname();

  const initials = [profile.first_name?.[0], profile.last_name?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase() || "?";

  const roleLabel = profile.role === "school_admin" ? "School Admin" : "Counsellor";

  return (
    <aside className="w-[220px] flex-shrink-0 bg-navy flex flex-col h-screen overflow-hidden relative">
      <div className="absolute bottom-[-100px] left-[-60px] w-[280px] h-[280px] rounded-full bg-[radial-gradient(circle,rgba(201,147,58,0.07)_0%,transparent_65%)] pointer-events-none" />

      {/* Logo */}
      <div className="px-5 pt-5 pb-3 border-b border-white/[0.07]">
        <div className="font-serif text-lg text-white">Edu<span className="text-gold">Path</span></div>
        <div className="text-[0.68rem] text-white/30 mt-0.5">Counsellor Portal</div>
      </div>

      {/* Nav sections */}
      <div className="flex-1 overflow-y-auto py-2">
        <NavSection label="Main" links={mainLinks} pathname={pathname} />
        <NavSection label="Explore" links={exploreLinks} pathname={pathname} />
        <NavSection label="Workspace" links={workspaceLinks} pathname={pathname} />
      </div>

      {/* User */}
      <div className="px-3 py-3 border-t border-white/[0.07] relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-sm text-white font-medium truncate">
              {profile.first_name} {profile.last_name}
            </div>
            <div className="text-[0.68rem] text-white/35">{roleLabel}</div>
          </div>
          <button
            onClick={() => signOut()}
            className="ml-auto text-[11px] text-white/25 hover:text-white/60 transition-colors"
            title="Sign out"
          >
            ↩
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavSection({
  label,
  links,
  pathname,
}: {
  label: string;
  links: typeof mainLinks;
  pathname: string;
}) {
  return (
    <div className="px-3 pt-3 pb-1">
      <div className="text-[0.62rem] font-semibold tracking-widest uppercase text-white/25 px-2 mb-1.5">
        {label}
      </div>
      {links.map((link) => {
        const isActive = link.href === "/counsellor"
          ? pathname === "/counsellor"
          : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[0.82rem] mb-px relative transition-colors ${
              isActive
                ? "bg-white/10 text-white font-medium"
                : "text-white/50 hover:bg-white/[0.06] hover:text-white/80"
            }`}
          >
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-gold rounded-r" />
            )}
            <span className="text-sm w-[18px] text-center flex-shrink-0">{link.icon}</span>
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
