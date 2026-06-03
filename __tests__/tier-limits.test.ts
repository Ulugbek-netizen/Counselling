import { describe, it, expect } from "vitest";
import type { TierStatus } from "@/lib/utils/tier-limits";

function shouldShowBanner(status: TierStatus): string | null {
  if (status.isReadOnly) return "read-only";
  if (status.subscriptionStatus === "grace_period") return "grace-period";
  if (status.atStudentLimit || status.atCounsellorLimit) return "at-limit";
  return null;
}

describe("Tier limits", () => {
  it("returns null for active, under-limit school", () => {
    const status: TierStatus = {
      tier: "starter", studentCount: 20, maxStudents: 50, counsellorCount: 2, maxCounsellors: 3,
      subscriptionStatus: "active", isReadOnly: false, atStudentLimit: false, atCounsellorLimit: false,
      gracePeriodEndsAt: null, daysUntilGraceExpires: null,
    };
    expect(shouldShowBanner(status)).toBeNull();
  });

  it("returns at-limit when student limit reached", () => {
    const status: TierStatus = {
      tier: "starter", studentCount: 50, maxStudents: 50, counsellorCount: 2, maxCounsellors: 3,
      subscriptionStatus: "active", isReadOnly: false, atStudentLimit: true, atCounsellorLimit: false,
      gracePeriodEndsAt: null, daysUntilGraceExpires: null,
    };
    expect(shouldShowBanner(status)).toBe("at-limit");
  });

  it("returns grace-period when payment failed", () => {
    const status: TierStatus = {
      tier: "growth", studentCount: 30, maxStudents: 150, counsellorCount: 4, maxCounsellors: 8,
      subscriptionStatus: "grace_period", isReadOnly: false, atStudentLimit: false, atCounsellorLimit: false,
      gracePeriodEndsAt: new Date(Date.now() + 5 * 86400000).toISOString(), daysUntilGraceExpires: 5,
    };
    expect(shouldShowBanner(status)).toBe("grace-period");
  });

  it("returns read-only when expired", () => {
    const status: TierStatus = {
      tier: "starter", studentCount: 50, maxStudents: 50, counsellorCount: 3, maxCounsellors: 3,
      subscriptionStatus: "expired", isReadOnly: true, atStudentLimit: true, atCounsellorLimit: true,
      gracePeriodEndsAt: null, daysUntilGraceExpires: null,
    };
    expect(shouldShowBanner(status)).toBe("read-only");
  });
});
