"use client";

import { useRef } from "react";

export interface TimelineRow {
  id: string;
  universityName: string;
  applicationType: string;
  status: "active" | "submitted" | "considering";
  startMonth: number;
  deadlineMonth: number;
  decisionMonth: number | null;
}

export interface TimelineExam {
  id: string;
  name: string;
  month: number;
}

interface Props {
  rows: TimelineRow[];
  exams: TimelineExam[];
  currentMonth: number;
}

const MONTHS = ["Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"];
const STATUS_COLORS = {
  active: { bar: "#FAEEDA", text: "#633806", label: "In progress" },
  submitted: { bar: "#EAF3DE", text: "#27500A", label: "Submitted" },
  considering: { bar: "#F1EFE8", text: "#444441", label: "Planning" },
};

export function ApplicationTimeline({ rows, exams, currentMonth }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const todayPos = ((currentMonth / 12) * 100);

  return (
    <div className="bg-white border border-cream-mid rounded-card overflow-hidden">
      <div className="px-4 py-3 border-b border-cream-mid flex items-center justify-between">
        <div className="font-serif text-sm text-navy">My application timeline</div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[0.68rem] text-slate-400"><span className="w-2 h-2 rounded-full bg-status-red" />Deadline</span>
          <span className="flex items-center gap-1.5 text-[0.68rem] text-slate-400"><span className="w-2 h-2 rounded-full bg-status-green" />Decision</span>
          <span className="flex items-center gap-1.5 text-[0.68rem] text-slate-400"><span className="w-2 h-2 rounded-full bg-status-blue" />Exam</span>
        </div>
      </div>

      <div ref={scrollRef} className="overflow-x-auto px-4 pb-4">
        <div className="min-w-[800px] pt-3 relative">
          {/* Today line */}
          <div
            className="absolute top-0 bottom-0 w-[1.5px] bg-status-red z-10"
            style={{ left: `calc(120px + ${todayPos}% * (100% - 120px) / 100)` }}
          >
            <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 text-[9px] text-status-red font-medium whitespace-nowrap">today</div>
          </div>

          {/* Month headers */}
          <div className="flex mb-2" style={{ paddingLeft: 120 }}>
            {MONTHS.map((m, i) => (
              <div
                key={m}
                className={`flex-1 text-center text-[0.65rem] font-medium pb-1.5 border-b border-cream-mid ${i === currentMonth ? "text-status-blue" : "text-slate-400"}`}
              >
                {m}
              </div>
            ))}
          </div>

          {/* University rows */}
          {rows.map((row) => {
            const colors = STATUS_COLORS[row.status];
            const left = (row.startMonth / 12) * 100;
            const width = ((row.deadlineMonth - row.startMonth) / 12) * 100;
            const dlPos = (row.deadlineMonth / 12) * 100;
            const decPos = row.decisionMonth ? (row.decisionMonth / 12) * 100 : null;

            return (
              <div key={row.id} className="flex items-center h-9 mb-1">
                <div className="w-[120px] flex-shrink-0 pr-3">
                  <div className="text-[0.72rem] font-medium text-navy truncate">{row.universityName}</div>
                  <div className="text-[0.6rem] text-slate-400">{row.applicationType}</div>
                </div>
                <div className="flex-1 relative h-full flex items-center">
                  <div className="absolute inset-0 border-b border-cream-mid/50" />
                  {/* Work bar */}
                  <div
                    className="absolute h-[18px] rounded flex items-center px-2"
                    style={{ left: `${left}%`, width: `${Math.max(width, 3)}%`, backgroundColor: colors.bar }}
                  >
                    <span className="text-[0.6rem] font-medium whitespace-nowrap" style={{ color: colors.text }}>{colors.label}</span>
                  </div>
                  {/* Deadline dot */}
                  <div
                    className="absolute w-[10px] h-[10px] rounded-full bg-status-red border-2 border-white z-[5]"
                    style={{ left: `${dlPos}%`, transform: "translateX(-50%)" }}
                    title="Deadline"
                  />
                  {/* Decision dot */}
                  {decPos && (
                    <div
                      className="absolute w-[10px] h-[10px] rounded-full bg-status-green border-2 border-white z-[5]"
                      style={{ left: `${decPos}%`, transform: "translateX(-50%)" }}
                      title="Decision"
                    />
                  )}
                </div>
              </div>
            );
          })}

          {/* Divider */}
          <div className="border-t border-dashed border-cream-mid my-2" style={{ marginLeft: 120 }} />

          {/* Exams row */}
          <div className="flex items-center h-7">
            <div className="w-[120px] flex-shrink-0 pr-3">
              <div className="text-[0.65rem] text-slate-400">Exams & tests</div>
            </div>
            <div className="flex-1 relative h-full flex items-center">
              <div className="absolute inset-x-0 top-1/2 h-[1.5px] bg-cream-mid" />
              {exams.map((exam) => {
                const pos = (exam.month / 12) * 100;
                return (
                  <div
                    key={exam.id}
                    className="absolute h-[14px] rounded bg-blue-50 border border-blue-100 flex items-center px-1.5 z-[5]"
                    style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
                  >
                    <span className="text-[0.55rem] font-medium text-status-blue whitespace-nowrap">{exam.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {rows.length === 0 && (
            <div className="text-center text-sm text-slate-300 py-10" style={{ marginLeft: 120 }}>
              Add universities to your list to see your timeline
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
