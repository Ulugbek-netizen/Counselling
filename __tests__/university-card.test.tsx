import { describe, it, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { UniversityCard } from "@/components/universities/university-card";

describe("UniversityCard", () => {
  const props = {
    id: "1", name: "MIT", country: "US", city: "Cambridge",
    tagline: "World-leading STEM university",
    tuition: 57590, tuitionCurrency: "USD", acceptanceRate: 3.2,
    matchScore: 88, matchLabel: "target" as const,
    topMajors: ["Computer Science", "Architecture"], totalPrograms: 53,
    applicationTypes: ["EA", "RD"],
    nextDeadline: { days: 2, label: "2d" },
    isBookmarked: false,
    onBookmark: () => {}, onClick: () => {},
  };

  it("renders university name and location", () => {
    const { container } = render(<UniversityCard {...props} />);
    expect(container.textContent).toContain("MIT");
    expect(container.textContent).toContain("Cambridge, US");
    cleanup();
  });

  it("renders match score", () => {
    const { container } = render(<UniversityCard {...props} />);
    expect(container.textContent).toContain("88%");
    expect(container.textContent).toContain("Target");
    cleanup();
  });

  it("renders majors and +more", () => {
    const { container } = render(<UniversityCard {...props} />);
    expect(container.textContent).toContain("Computer Science");
    expect(container.textContent).toContain("+51 more");
    cleanup();
  });

  it("renders deadline badge", () => {
    const { container } = render(<UniversityCard {...props} />);
    expect(container.textContent).toContain("2d");
    cleanup();
  });
});
