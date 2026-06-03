import { describe, it, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { ApplicationTimeline } from "@/components/dashboard/application-timeline";
import type { TimelineRow, TimelineExam } from "@/components/dashboard/application-timeline";

describe("ApplicationTimeline", () => {
  const rows: TimelineRow[] = [
    { id: "1", universityName: "MIT", applicationType: "Early Action", status: "active", startMonth: 0, deadlineMonth: 3, decisionMonth: 6 },
    { id: "2", universityName: "Stanford", applicationType: "REA", status: "submitted", startMonth: 1, deadlineMonth: 4, decisionMonth: 7 },
  ];
  const exams: TimelineExam[] = [
    { id: "e1", name: "SAT", month: 2 },
    { id: "e2", name: "IELTS", month: 5 },
  ];

  it("renders university names", () => {
    const { container } = render(<ApplicationTimeline rows={rows} exams={exams} currentMonth={3} />);
    expect(container.textContent).toContain("MIT");
    expect(container.textContent).toContain("Stanford");
    cleanup();
  });

  it("renders exam labels", () => {
    const { container } = render(<ApplicationTimeline rows={rows} exams={exams} currentMonth={3} />);
    expect(container.textContent).toContain("SAT");
    expect(container.textContent).toContain("IELTS");
    cleanup();
  });

  it("renders month headers", () => {
    const { container } = render(<ApplicationTimeline rows={rows} exams={exams} currentMonth={3} />);
    expect(container.textContent).toContain("Sep");
    expect(container.textContent).toContain("Jan");
    expect(container.textContent).toContain("Aug");
    cleanup();
  });

  it("shows empty state when no rows", () => {
    const { container } = render(<ApplicationTimeline rows={[]} exams={[]} currentMonth={3} />);
    expect(container.textContent).toContain("Add universities to your list");
    cleanup();
  });

  it("renders legend", () => {
    const { container } = render(<ApplicationTimeline rows={rows} exams={exams} currentMonth={3} />);
    expect(container.textContent).toContain("Deadline");
    expect(container.textContent).toContain("Decision");
    expect(container.textContent).toContain("Exam");
    cleanup();
  });
});
