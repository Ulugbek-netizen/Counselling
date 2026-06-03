"use client";

import { useState } from "react";
import type { StudentRow } from "@/lib/queries/student-list";

const STATUS_STYLES = {
  priority: "bg-red-50 text-status-red",
  active: "bg-amber-50 text-status-amber",
  on_track: "bg-emerald-50 text-status-green",
  early_stage: "bg-gray-100 text-slate-500",
};

const STATUS_LABELS = {
  priority: "Priority",
  active: "Active",
  on_track: "On track",
  early_stage: "Early stage",
};

const DEADLINE_STYLES = {
  critical: "bg-red-50 text-status-red",
  soon: "bg-amber-50 text-status-amber",
  ok: "bg-emerald-50 text-status-green",
};

export function StudentsTable({ students }: { students: StudentRow[] }) {
  const [search, setSearch] = useState("");

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.universities.toLowerCase().includes(q) ||
      s.grade.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search students by name, university, grade…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy bg-white outline-none focus:border-navy transition-colors"
        />
      </div>

      <div className="bg-white border border-cream-mid rounded-card overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_80px] px-4 py-2.5 border-b border-cream-mid bg-cream">
          <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Student</div>
          <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Universities</div>
          <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Last session</div>
          <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Deadline</div>
          <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Progress</div>
          <div className="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-400">Status</div>
        </div>

        {/* Rows */}
        {filtered.map((s) => {
          const dlUrgency = s.nextDeadline
            ? s.nextDeadline.days <= 7 ? "critical" : s.nextDeadline.days <= 30 ? "soon" : "ok"
            : null;

          return (
            <div
              key={s.id}
              className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_80px] px-4 py-3 border-b border-cream-mid last:border-b-0 hover:bg-cream/50 transition-colors cursor-pointer items-center"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[0.68rem] font-semibold text-white flex-shrink-0"
                  style={{ backgroundColor: s.color }}
                >
                  {s.initials}
                </div>
                <div>
                  <div className="text-[0.82rem] font-medium text-navy">{s.name}</div>
                  <div className="text-xs text-slate-400">Grade {s.grade}</div>
                </div>
              </div>
              <div className="text-xs text-slate-400 truncate">{s.universities}</div>
              <div className="text-xs text-slate-400">{s.lastSession}</div>
              <div>
                {s.nextDeadline && dlUrgency ? (
                  <span className={`text-[0.65rem] font-medium px-1.5 py-0.5 rounded-full ${DEADLINE_STYLES[dlUrgency]}`}>
                    {s.nextDeadline.label}
                  </span>
                ) : (
                  <span className="text-xs text-slate-300">—</span>
                )}
              </div>
              <div>
                <div className="w-20 h-[5px] bg-cream-mid rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-navy transition-all"
                    style={{ width: `${s.progressPercent}%` }}
                  />
                </div>
              </div>
              <div>
                <span className={`text-[0.65rem] font-medium px-1.5 py-0.5 rounded-full ${STATUS_STYLES[s.status]}`}>
                  {STATUS_LABELS[s.status]}
                </span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center text-sm text-slate-300 py-12">
            {search ? "No students match your search" : "No students yet"}
          </div>
        )}
      </div>
    </>
  );
}
