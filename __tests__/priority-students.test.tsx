import { describe, it, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { PriorityStudentsPanel } from "@/components/dashboard/priority-students";
import type { PriorityStudent } from "@/components/dashboard/priority-students";

describe("PriorityStudentsPanel", () => {
  const students: PriorityStudent[] = [
    { id: "1", initials: "AD", name: "Aisha Demberel", meta: "Last meeting: 38 days ago", color: "#C9933A", tags: [{ label: "Overdue", type: "red" }] },
    { id: "2", initials: "BG", name: "Bataa Gantulga", meta: "Last meeting: 31 days ago", color: "#2563EB", tags: [{ label: "No recent session", type: "amber" }] },
  ];

  it("renders student names", () => {
    const { container } = render(<PriorityStudentsPanel students={students} />);
    expect(container.textContent).toContain("Aisha Demberel");
    expect(container.textContent).toContain("Bataa Gantulga");
    cleanup();
  });

  it("renders tags", () => {
    const { container } = render(<PriorityStudentsPanel students={students} />);
    expect(container.textContent).toContain("Overdue");
    expect(container.textContent).toContain("No recent session");
    cleanup();
  });

  it("shows empty state when no priority students", () => {
    const { container } = render(<PriorityStudentsPanel students={[]} />);
    expect(container.textContent).toContain("All students are on track");
    cleanup();
  });
});
