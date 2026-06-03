"use client";

import { useState } from "react";

export interface CalendarEvent {
  id: string;
  date: string;
  type: "deadline" | "session" | "birthday" | "exam";
  title: string;
  subtitle: string;
}

const TYPE_COLORS = {
  deadline: "#C0392B",
  session: "#C9933A",
  birthday: "#1A7F6E",
  exam: "#6D28D9",
};

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_LABELS = ["Mo","Tu","We","Th","Fr","Sa","Su"];

export function MiniCalendar({ events }: { events: CalendarEvent[] }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  function changeMonth(dir: number) {
    let m = month + dir;
    let y = year;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }
    setMonth(m);
    setYear(y);
  }

  // Build calendar grid
  const firstDay = new Date(year, month, 1);
  const startDow = (firstDay.getDay() + 6) % 7; // Monday-based
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: { day: number; current: boolean }[] = [];
  for (let i = startDow - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, current: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - startDow - daysInMonth + 1, current: false });

  // Map events to dates
  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const key = e.date;
    if (!eventsByDate.has(key)) eventsByDate.set(key, []);
    eventsByDate.get(key)!.push(e);
  }

  function getDateKey(day: number) {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  }

  function getDotColor(day: number): string | null {
    const evts = eventsByDate.get(getDateKey(day));
    if (!evts || evts.length === 0) return null;
    return TYPE_COLORS[evts[0].type];
  }

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  // Upcoming events for list
  const todayStr = today.toISOString().split("T")[0];
  const upcoming = events
    .filter((e) => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8);

  return (
    <div className="bg-white border border-cream-mid rounded-card flex flex-col overflow-hidden h-full">
      {/* Header */}
      <div className="px-4 pt-3.5 pb-2.5 border-b border-cream-mid flex items-center justify-between">
        <div className="font-serif text-sm text-navy">{MONTH_NAMES[month]} {year}</div>
        <div className="flex gap-1">
          <button
            onClick={() => changeMonth(-1)}
            className="w-6 h-6 rounded-md border border-cream-mid flex items-center justify-center text-xs text-slate-400 hover:bg-cream transition-colors"
          >
            ‹
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="w-6 h-6 rounded-md border border-cream-mid flex items-center justify-center text-xs text-slate-400 hover:bg-cream transition-colors"
          >
            ›
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="px-3 pt-2">
        <div className="grid grid-cols-7 gap-px mb-1">
          {DAY_LABELS.map((d) => (
            <div key={d} className="text-center text-[0.6rem] font-semibold tracking-wide text-slate-400 py-0.5">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px">
          {cells.map((cell, i) => {
            const dot = cell.current ? getDotColor(cell.day) : null;
            return (
              <div
                key={i}
                className={`aspect-square rounded-md flex flex-col items-center justify-center text-xs relative cursor-pointer transition-colors ${
                  !cell.current
                    ? "text-cream-dark"
                    : isToday(cell.day)
                    ? "bg-navy text-white font-semibold"
                    : "text-slate-500 hover:bg-cream"
                }`}
              >
                {cell.day}
                {dot && (
                  <span
                    className="absolute bottom-[3px] w-1 h-1 rounded-full"
                    style={{ backgroundColor: dot }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Event list */}
      <div className="flex-1 overflow-y-auto px-3.5 pb-3 pt-2 mt-1">
        <div className="text-[0.65rem] font-semibold tracking-widest uppercase text-slate-400 mb-2">
          Upcoming events
        </div>
        {upcoming.map((e) => (
          <div
            key={e.id}
            className="flex items-start gap-2 px-2 py-2 rounded-lg mb-1 bg-cream border border-cream-mid"
          >
            <span
              className="w-[7px] h-[7px] rounded-full flex-shrink-0 mt-1"
              style={{ backgroundColor: TYPE_COLORS[e.type] }}
            />
            <div>
              <div className="text-xs font-medium text-navy leading-tight">{e.title}</div>
              <div className="text-[0.68rem] text-slate-400">{e.subtitle}</div>
            </div>
          </div>
        ))}
        {upcoming.length === 0 && (
          <div className="text-xs text-slate-300 text-center py-4">No upcoming events</div>
        )}
      </div>
    </div>
  );
}
