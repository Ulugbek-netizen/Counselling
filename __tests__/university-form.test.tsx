import { describe, it, expect } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { UniversityForm } from "@/app/admin/universities/university-form";

describe("UniversityForm", () => {
  it("renders step 1 (basic info) by default", () => {
    const { container } = render(<UniversityForm />);
    expect(container.textContent).toContain("Basic information");
    expect(container.textContent).toContain("University name");
    cleanup();
  });

  it("navigates to next step", () => {
    const { container } = render(<UniversityForm />);
    const nextBtn = container.querySelector("button:last-of-type")!;
    fireEvent.click(nextBtn);
    expect(container.textContent).toContain("Programs");
    cleanup();
  });

  it("shows all 7 step labels", () => {
    const { container } = render(<UniversityForm />);
    expect(container.textContent).toContain("Basic info");
    expect(container.textContent).toContain("Programs");
    expect(container.textContent).toContain("Requirements");
    expect(container.textContent).toContain("Deadlines");
    expect(container.textContent).toContain("Application pathways");
    expect(container.textContent).toContain("Special features");
    expect(container.textContent).toContain("Review");
    cleanup();
  });
});
