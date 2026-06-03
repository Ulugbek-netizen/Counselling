import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MiniCalendar } from "@/components/dashboard/mini-calendar";
import type { CalendarEvent } from "@/components/dashboard/mini-calendar";

describe("MiniCalendar", () => {
  const events: CalendarEvent[] = [
    { id: "1", date: "2026-06-04", type: "deadline", title: "MIT deadline", subtitle: "Jun 4" },
    { id: "2", date: "2026-06-07", type: "exam", title: "IELTS", subtitle: "Jun 7" },
  ];

  it("renders month and year", () => {
    const { container } = render(<MiniCalendar events={[]} />);
    const now = new Date();
    const monthName = now.toLocaleString("en-US", { month: "long" });
    expect(container.textContent).toContain(monthName);
    cleanup();
  });

  it("renders day labels", () => {
    const { container } = render(<MiniCalendar events={[]} />);
    expect(container.textContent).toContain("Mo");
    expect(container.textContent).toContain("Fr");
    expect(container.textContent).toContain("Su");
    cleanup();
  });

  it("navigates months with arrows", () => {
    const { container } = render(<MiniCalendar events={[]} />);
    const nextBtn = container.querySelector('button:last-of-type')!;
    fireEvent.click(nextBtn);
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1);
    const nextMonthName = nextMonth.toLocaleString("en-US", { month: "long" });
    expect(container.textContent).toContain(nextMonthName);
    cleanup();
  });

  it("shows upcoming events heading", () => {
    const { container } = render(<MiniCalendar events={events} />);
    expect(container.textContent).toContain("Upcoming events");
    cleanup();
  });

  it("shows no events message when empty", () => {
    const { container } = render(<MiniCalendar events={[]} />);
    expect(container.textContent).toContain("No upcoming events");
    cleanup();
  });
});
