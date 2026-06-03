import { describe, it, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { UrgentDeadlinesPanel } from "@/components/dashboard/urgent-deadlines";
import type { UrgentDeadline } from "@/components/dashboard/urgent-deadlines";

describe("UrgentDeadlinesPanel", () => {
  const deadlines: UrgentDeadline[] = [
    { id: "1", university: "MIT", studentName: "Aisha D.", daysLeft: 2, urgency: "critical" },
    { id: "2", university: "Oxford", studentName: "Bataa G.", daysLeft: 14, urgency: "soon" },
  ];

  it("renders deadlines", () => {
    const { container } = render(<UrgentDeadlinesPanel deadlines={deadlines} />);
    expect(container.textContent).toContain("MIT");
    expect(container.textContent).toContain("2 days");
    expect(container.textContent).toContain("Oxford");
    cleanup();
  });

  it("shows empty state", () => {
    const { container } = render(<UrgentDeadlinesPanel deadlines={[]} />);
    expect(container.textContent).toContain("No upcoming deadlines");
    cleanup();
  });
});
