import { describe, it, expect } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { StudentsTable } from "@/app/counsellor/students/students-table";
import type { StudentRow } from "@/lib/queries/student-list";

const students: StudentRow[] = [
  { id: "1", initials: "AD", name: "Aisha Demberel", grade: "11", color: "#C9933A", universities: "MIT, Stanford", lastSession: "38 days ago", nextDeadline: { days: 2, label: "2 days" }, progressPercent: 72, status: "priority" },
  { id: "2", initials: "BG", name: "Bataa Gantulga", grade: "12", color: "#2563EB", universities: "Oxford, UCL", lastSession: "31 days ago", nextDeadline: { days: 21, label: "21 days" }, progressPercent: 55, status: "active" },
];

describe("StudentsTable", () => {
  it("renders student names", () => {
    const { container } = render(<StudentsTable students={students} />);
    expect(container.textContent).toContain("Aisha Demberel");
    expect(container.textContent).toContain("Bataa Gantulga");
    cleanup();
  });

  it("filters by search", () => {
    const { container } = render(<StudentsTable students={students} />);
    const input = container.querySelector("input")!;
    fireEvent.change(input, { target: { value: "Aisha" } });
    expect(container.textContent).toContain("Aisha Demberel");
    expect(container.textContent).not.toContain("Bataa Gantulga");
    cleanup();
  });

  it("filters by university", () => {
    const { container } = render(<StudentsTable students={students} />);
    const input = container.querySelector("input")!;
    fireEvent.change(input, { target: { value: "Oxford" } });
    expect(container.textContent).toContain("Bataa Gantulga");
    expect(container.textContent).not.toContain("Aisha Demberel");
    cleanup();
  });

  it("shows empty state", () => {
    const { container } = render(<StudentsTable students={[]} />);
    expect(container.textContent).toContain("No students yet");
    cleanup();
  });
});
