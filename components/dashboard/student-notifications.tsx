"use client";

import { useState } from "react";

export interface NotifItem {
  id: string;
  title: string;
  subtitle: string;
  daysLeft: number;
  urgency: "urgent" | "soon" | "ok";
}

export interface StudentNotifData {
  deadlines: NotifItem[];
  scholarships: NotifItem[];
  exams: NotifItem[];
}

const URGENCY_BAR = { urgent: "#C0392B", soon: "#B7770D", ok: "#1A7F6E" };
const URGENCY_BADGE = { urgent: "bg-red-50 text-status-red", soon: "bg-amber-50 text-status-amber", ok: "bg-emerald-50 text-status-green" };

type TimeFilter = "week" | "month" | "all";

export function StudentNotificationPanel({ data }: { data: StudentNotifData }) {
  const [filter, setFilter] = useState<TimeFilter>("month");

  const filterDays = filter === "week" ? 7 : filter === "month" ? 30 : 9999;
  const filterItems = (items: NotifItem[]) => items.filter((i) => i.daysLeft <= filterDays).slice(0, 5);

  const deadlines = filterItems(data.deadlines);
  const scholarships = filterItems(data.scholarships);
  const exams = filterItems(data.exams);

  return (
    <div className="bg-white border border-cream-mid rounded-card overflow-hidden">
      <div className="px-4 py-3 border-b border-cream-mid flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-[7px] h-[7px] rounded-full bg-status-red flex-shrink-0" />
          <span className="text-xs font-medium text-navy">Upcoming — what needs your attention</span>
        </div>
        <div className="flex gap-1 bg-cream-mid rounded-lg p-0.5">
          {(["week", "month", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-md text-[0.7rem] font-medium transition-colors ${filter === f ? "bg-white text-navy shadow-sm" : "text-slate-400"}`}
            >
              {f === "week" ? "This week" : f === "month" ? "30 days" : "All"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-cream-mid">
        <Column title="Application deadlines" count={deadlines.length} countColor="bg-red-50 text-status-red" items={deadlines} />
        <Column title="Scholarships & programs" count={scholarships.length} countColor="bg-amber-50 text-status-amber" items={scholarships} />
        <Column title="Exams & tests" count={exams.length} countColor="bg-purple-50 text-status-purple" items={exams} />
      </div>
    </div>
  );
}

function Column({ title, count, countColor, items }: { title: string; count: number; countColor: string; items: NotifItem[] }) {
  return (
    <div>
      <div className="px-3 py-2 border-b border-cream-mid flex items-center gap-2">
        <span className="text-[0.65rem] font-semibold tracking-wider uppercase text-slate-400">{title}</span>
        {count > 0 && <span className={`text-[0.65rem] font-medium px-1.5 py-0.5 rounded-full ${countColor}`}>{count}</span>}
      </div>
      {items.map((item) => (
        <div key={item.id} className="flex items-start gap-2 px-3 py-2.5 border-b border-cream-mid last:border-b-0 hover:bg-cream/50 transition-colors cursor-pointer">
          <div className="w-[3px] rounded self-stretch flex-shrink-0" style={{ backgroundColor: URGENCY_BAR[item.urgency] }} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-navy truncate">{item.title}</div>
            <div className="text-[0.68rem] text-slate-400">{item.subtitle}</div>
          </div>
          <span className={`text-[0.62rem] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ${URGENCY_BADGE[item.urgency]}`}>
            {item.daysLeft} {item.daysLeft === 1 ? "day" : "days"}
          </span>
        </div>
      ))}
      {items.length === 0 && <div className="text-[0.7rem] text-slate-300 text-center py-6">Nothing upcoming</div>}
    </div>
  );
}
