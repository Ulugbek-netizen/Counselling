import type { SupabaseClient } from "@supabase/supabase-js";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Client = SupabaseClient<any, any, any>;

export interface TierStatus {
  tier: string;
  studentCount: number;
  maxStudents: number;
  counsellorCount: number;
  maxCounsellors: number;
  subscriptionStatus: string;
  isReadOnly: boolean;
  atStudentLimit: boolean;
  atCounsellorLimit: boolean;
  gracePeriodEndsAt: string | null;
  daysUntilGraceExpires: number | null;
}

export async function checkTierLimits(supabase: Client, schoolId: string): Promise<TierStatus> {
  const { data: school } = await supabase.from("schools").select("subscription_tier, subscription_status, max_students, max_counsellors, grace_period_ends_at").eq("id", schoolId).single();

  if (!school) throw new Error("School not found");

  const { count: studentCount } = await supabase.from("profiles").select("id", { count: "exact", head: true }).eq("school_id", schoolId).eq("role", "student");
  const { count: counsellorCount } = await supabase.from("profiles").select("id", { count: "exact", head: true }).eq("school_id", schoolId).in("role", ["counsellor", "school_admin"]);

  const isGracePeriod = school.subscription_status === "grace_period";
  const isExpired = school.subscription_status === "expired";
  const isReadOnly = isExpired || (isGracePeriod && school.grace_period_ends_at && new Date(school.grace_period_ends_at) < new Date());

  let daysUntilGraceExpires: number | null = null;
  if (isGracePeriod && school.grace_period_ends_at) {
    daysUntilGraceExpires = Math.ceil((new Date(school.grace_period_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  }

  return {
    tier: school.subscription_tier,
    studentCount: studentCount ?? 0,
    maxStudents: school.max_students,
    counsellorCount: counsellorCount ?? 0,
    maxCounsellors: school.max_counsellors,
    subscriptionStatus: school.subscription_status,
    isReadOnly,
    atStudentLimit: (studentCount ?? 0) >= school.max_students,
    atCounsellorLimit: (counsellorCount ?? 0) >= school.max_counsellors,
    gracePeriodEndsAt: school.grace_period_ends_at,
    daysUntilGraceExpires,
  };
}
