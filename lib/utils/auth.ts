import type { UserRole } from "@/types/database";

export function getRedirectPath(role: UserRole): string {
  switch (role) {
    case "platform_admin":
      return "/admin";
    case "school_admin":
    case "counsellor":
      return "/counsellor";
    case "student":
      return "/student";
  }
}

export function isPublicPath(pathname: string): boolean {
  const publicPaths = ["/", "/sign-in", "/sign-up", "/request-access", "/demo"];
  return publicPaths.some((p) => pathname === p);
}

export function getRoleDashboardLabel(role: UserRole): string {
  switch (role) {
    case "platform_admin":
      return "Platform Admin";
    case "school_admin":
      return "School Admin";
    case "counsellor":
      return "Counsellor";
    case "student":
      return "Student";
  }
}
