import Link from "next/link";

export interface PriorityStudent {
  id: string;
  initials: string;
  name: string;
  meta: string;
  color: string;
  tags: { label: string; type: "red" | "amber" | "green" | "blue" | "purple" }[];
}

const TAG_STYLES = {
  red: "bg-red-50 text-status-red",
  amber: "bg-amber-50 text-status-amber",
  green: "bg-emerald-50 text-status-green",
  blue: "bg-blue-50 text-status-blue",
  purple: "bg-purple-50 text-status-purple",
};

export function PriorityStudentsPanel({ students }: { students: PriorityStudent[] }) {
  return (
    <div className="bg-white border border-cream-mid rounded-card flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-cream-mid flex items-center justify-between">
        <div className="font-serif text-sm text-navy">Priority students</div>
        <Link href="/counsellor/students" className="text-xs text-gold font-medium hover:underline">
          View all →
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        {students.map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-2.5 px-4 py-3 border-b border-cream-mid last:border-b-0 hover:bg-cream/50 transition-colors cursor-pointer"
          >
            <div
              className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
              style={{ backgroundColor: s.color }}
            >
              {s.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[0.83rem] font-medium text-navy truncate">{s.name}</div>
              <div className="text-xs text-slate-400 truncate">{s.meta}</div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              {s.tags.map((t, i) => (
                <span key={i} className={`text-[0.65rem] font-medium px-1.5 py-0.5 rounded-full ${TAG_STYLES[t.type]}`}>
                  {t.label}
                </span>
              ))}
            </div>
          </div>
        ))}
        {students.length === 0 && (
          <div className="text-xs text-slate-300 text-center py-8">All students are on track</div>
        )}
      </div>
    </div>
  );
}
