import type { TierStatus } from "@/lib/utils/tier-limits";

export function TierLimitBanner({ status }: { status: TierStatus }) {
  if (status.subscriptionStatus === "active" && !status.atStudentLimit && !status.atCounsellorLimit) return null;

  if (status.isReadOnly) {
    return (
      <div className="bg-status-red text-white px-7 py-3 text-sm">
        <strong>Read-only mode.</strong> Your subscription has expired. You can view data but cannot add or edit. Contact your platform administrator to reactivate.
      </div>
    );
  }

  if (status.subscriptionStatus === "grace_period") {
    return (
      <div className="bg-status-amber text-white px-7 py-3 text-sm">
        <strong>Payment issue.</strong> Your subscription payment failed. You have {status.daysUntilGraceExpires ?? 0} days before your school goes read-only.
      </div>
    );
  }

  if (status.atStudentLimit || status.atCounsellorLimit) {
    const limits = [];
    if (status.atStudentLimit) limits.push(`students (${status.studentCount}/${status.maxStudents})`);
    if (status.atCounsellorLimit) limits.push(`counsellors (${status.counsellorCount}/${status.maxCounsellors})`);
    return (
      <div className="bg-gold/10 text-gold px-7 py-2.5 text-sm">
        You&apos;ve reached your <strong>{status.tier}</strong> plan limit for {limits.join(" and ")}. Contact us to upgrade.
      </div>
    );
  }

  return null;
}
