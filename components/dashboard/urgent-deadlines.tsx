import Link from "next/link";

export interface UrgentDeadline {
  id: string;
  university: string;
  studentName: string;
  daysLeft: number;
  urgency: "critical" | "soon" | "ok";
}

const URGENCY_BAR = { critical: "#C0392B", soon: "#B7770D", ok: "#1A7F6E" };
const URGENCY_BADGE = {
  critical: "bg-red-50 text-status-red",
  soon: "bg-amber-50 text-status-amber",
  ok: "bg-emerald-50 text-status-green",
};

export function UrgentDeadlinesPanel({ deadlines }: { deadlines: UrgentDeadline[] }) {
  return (
    <div className="bg-white border border-cream-mid rounded-card flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-cream-mid flex items-center justify-between">
        <div className="font-serif text-sm text-navy">Urgent deadlines</div>
        <Link href="/counsellor/applications" className="text-xs text-gold font-medium hover:underline">
          All →
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        {deadlines.map((d) => (
          <div
            key={d.id}
            className="flex items-start gap-2.5 px-4 py-2.5 border-b border-cream-mid last:border-b-0 hover:bg-cream/50 transition-colors cursor-pointer"
          >
            <div
              className="w-[3px] rounded self-stretch flex-shrink-0"
              style={{ backgroundColor: URGENCY_BAR[d.urgency] }}
            />
            <div className="min-w-0 flex-1">
              <div className="text-[0.8rem] font-medium text-navy">{d.university}</div>
              <div className="text-[0.7rem] text-slate-400">{d.studentName}</div>
            </div>
            <span className={`text-[0.7rem] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${URGENCY_BADGE[d.urgency]}`}>
              {d.daysLeft} {d.daysLeft === 1 ? "day" : "days"}
            </span>
          </div>
        ))}
        {deadlines.length === 0 && (
          <div className="text-xs text-slate-300 text-center py-8">No upcoming deadlines</div>
        )}
      </div>
    </div>
  );
}
