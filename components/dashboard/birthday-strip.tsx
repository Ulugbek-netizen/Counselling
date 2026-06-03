import type { BirthdayReminder } from "@/lib/queries/counsellor-dashboard";

export function BirthdayStrip({ birthdays }: { birthdays: BirthdayReminder[] }) {
  if (!birthdays.length) return null;

  return (
    <div className="mx-6 mt-4 bg-emerald-50 border border-emerald-100 rounded-card px-4 py-2.5 flex items-center gap-3 flex-wrap">
      <span className="text-base flex-shrink-0" aria-hidden>🎂</span>
      <span className="text-[0.72rem] font-semibold text-status-green uppercase tracking-wide flex-shrink-0">
        Upcoming birthdays
      </span>
      <div className="flex flex-wrap gap-2">
        {birthdays.map((b) => (
          <span
            key={b.id}
            className="inline-flex items-center gap-1.5 bg-white border border-emerald-100 rounded-full px-3 py-1 text-[0.72rem] text-navy"
          >
            <span className="font-medium">{b.name}</span>
            <span className="text-slate-400">turns {b.ageTurning}</span>
            <span className="text-status-green font-medium">
              {b.daysUntil === 0 ? "today 🎉" : b.daysUntil === 1 ? "tomorrow" : `in ${b.daysUntil}d`}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-400">{b.birthdayDate}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
