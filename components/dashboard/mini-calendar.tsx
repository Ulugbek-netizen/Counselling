"use client";

import { useState, useRef, useEffect } from "react";

export interface CalendarEvent {
  id: string;
  date: string;
  type: "deadline" | "session" | "birthday" | "exam";
  title: string;
  subtitle: string;
}

const TYPE_COLORS: Record<CalendarEvent["type"], string> = {
  deadline: "#C0392B",
  session: "#2E4F8A",
  birthday: "#1A7F6E",
  exam: "#C9933A",
};

const TYPE_LABELS: Record<CalendarEvent["type"], string> = {
  session: "Session",
  deadline: "Deadline",
  birthday: "Birthday",
  exam: "Exam",
};

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_LABELS = ["Mo","Tu","We","Th","Fr","Sa","Su"];

export function MiniCalendar({ events }: { events: CalendarEvent[] }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  function changeMonth(dir: number) {
    let m = month + dir;
    let y = year;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }
    setMonth(m);
    setYear(y);
    setSelectedDate(null);
  }

  // Build calendar grid
  const firstDay = new Date(year, month, 1);
  const startDow = (firstDay.getDay() + 6) % 7; // Monday-based (0=Mon)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: { day: number; current: boolean }[] = [];
  for (let i = startDow - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, current: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true });
  while (cells.length % 7 !== 0) {
    cells.push({ day: cells.length - startDow - daysInMonth + 1, current: false });
  }

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

  function getDotColors(day: number): string[] {
    const evts = eventsByDate.get(getDateKey(day));
    if (!evts || evts.length === 0) return [];
    // Return up to 3 unique type colors
    const seen = new Set<string>();
    const colors: string[] = [];
    for (const e of evts) {
      const c = TYPE_COLORS[e.type];
      if (!seen.has(c)) { seen.add(c); colors.push(c); }
      if (colors.length >= 3) break;
    }
    return colors;
  }

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  function handleDayClick(day: number, current: boolean) {
    if (!current) return;
    const key = getDateKey(day);
    const evts = eventsByDate.get(key);
    if (!evts || evts.length === 0) {
      setSelectedDate(null);
      return;
    }
    setSelectedDate(selectedDate === key ? null : key);
  }

  // Close popover on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setSelectedDate(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Upcoming events for list
  const todayStr = today.toISOString().split("T")[0];
  const upcoming = events
    .filter((e) => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8);

  const selectedEvents = selectedDate ? (eventsByDate.get(selectedDate) ?? []) : [];

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
      <div className="px-3 pt-2 relative" ref={popoverRef}>
        <div className="grid grid-cols-7 gap-px mb-1">
          {DAY_LABELS.map((d) => (
            <div key={d} className="text-center text-[0.6rem] font-semibold tracking-wide text-slate-400 py-0.5">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px">
          {cells.map((cell, i) => {
            const dots = cell.current ? getDotColors(cell.day) : [];
            const dateKey = cell.current ? getDateKey(cell.day) : "";
            const isSelected = selectedDate === dateKey && dateKey !== "";
            return (
              <div
                key={i}
                onClick={() => handleDayClick(cell.day, cell.current)}
                className={`aspect-square rounded-md flex flex-col items-center justify-center text-xs relative transition-colors ${
                  !cell.current
                    ? "text-slate-300"
                    : isToday(cell.day)
                    ? "bg-navy text-white font-semibold"
                    : isSelected
                    ? "bg-navy/10 text-navy font-medium"
                    : dots.length > 0
                    ? "text-navy cursor-pointer hover:bg-cream"
                    : "text-slate-500 hover:bg-cream cursor-default"
                }`}
              >
                <span className="leading-none mb-[3px]">{cell.day}</span>
                {dots.length > 0 && (
                  <span className="flex gap-[2px] absolute bottom-[2px]">
                    {dots.map((color, di) => (
                      <span
                        key={di}
                        className="w-[5px] h-[5px] rounded-full"
                        style={{ backgroundColor: isToday(cell.day) ? "white" : color }}
                      />
                    ))}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Popover for selected day events */}
        {selectedDate && selectedEvents.length > 0 && (
          <div className="absolute left-3 right-3 z-10 bg-white border border-cream-mid rounded-xl shadow-lg p-3 mt-1">
            <div className="text-[0.65rem] font-semibold tracking-widest uppercase text-slate-400 mb-2">
              {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}
            </div>
            <div className="space-y-1.5">
              {selectedEvents.map((e) => (
                <div key={e.id} className="flex items-start gap-2">
                  <span
                    className="w-[6px] h-[6px] rounded-full flex-shrink-0 mt-1"
                    style={{ backgroundColor: TYPE_COLORS[e.type] }}
                  />
                  <div>
                    <div className="text-xs font-medium text-navy leading-tight">{e.title}</div>
                    <div className="text-[0.67rem] text-slate-400">{e.subtitle} · {TYPE_LABELS[e.type]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
