import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "@/components/dashboard/stat-card";

describe("StatCard", () => {
  it("renders label and value", () => {
    render(<StatCard label="Total students" value={24} />);
    expect(screen.getByText("Total students")).toBeDefined();
    expect(screen.getByText("24")).toBeDefined();
  });

  it("renders subtitle when provided", () => {
    render(<StatCard label="Priority" value={5} subtitle="No meeting in 30+ days" />);
    expect(screen.getByText("No meeting in 30+ days")).toBeDefined();
  });

  it("applies accent color to value", () => {
    render(<StatCard label="Active" value={87} accentColor="#C0392B" />);
    const value = screen.getByText("87");
    expect(value.style.color).toBe("rgb(192, 57, 43)");
  });

  it("renders string values", () => {
    render(<StatCard label="Next deadline" value="3 days" />);
    expect(screen.getByText("3 days")).toBeDefined();
  });
});
