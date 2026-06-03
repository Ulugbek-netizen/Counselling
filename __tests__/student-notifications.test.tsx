import { describe, it, expect } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { StudentNotificationPanel } from "@/components/dashboard/student-notifications";
import type { StudentNotifData } from "@/components/dashboard/student-notifications";

const data: StudentNotifData = {
  deadlines: [
    { id: "1", title: "MIT", subtitle: "Jun 4", daysLeft: 2, urgency: "urgent" },
    { id: "2", title: "Stanford", subtitle: "Jun 16", daysLeft: 14, urgency: "soon" },
  ],
  scholarships: [
    { id: "3", title: "Gates Scholarship", subtitle: "Jun 10", daysLeft: 8, urgency: "soon" },
  ],
  exams: [
    { id: "4", title: "IELTS", subtitle: "Jun 7", daysLeft: 5, urgency: "urgent" },
  ],
};

describe("StudentNotificationPanel", () => {
  it("renders all three columns", () => {
    const { container } = render(<StudentNotificationPanel data={data} />);
    expect(container.textContent).toContain("Application deadlines");
    expect(container.textContent).toContain("Scholarships & programs");
    expect(container.textContent).toContain("Exams & tests");
    cleanup();
  });

  it("shows items in each column", () => {
    const { container } = render(<StudentNotificationPanel data={data} />);
    expect(container.textContent).toContain("MIT");
    expect(container.textContent).toContain("Gates Scholarship");
    expect(container.textContent).toContain("IELTS");
    cleanup();
  });

  it("time filter changes visible items", () => {
    const longData: StudentNotifData = {
      deadlines: [{ id: "1", title: "Far deadline", subtitle: "Dec 1", daysLeft: 180, urgency: "ok" }],
      scholarships: [],
      exams: [],
    };
    const { container } = render(<StudentNotificationPanel data={longData} />);
    // Default is 30 days, so 180-day item hidden
    expect(container.textContent).not.toContain("Far deadline");
    // Switch to All
    const allBtn = container.querySelector('button:last-of-type')!;
    fireEvent.click(allBtn);
    expect(container.textContent).toContain("Far deadline");
    cleanup();
  });
});
