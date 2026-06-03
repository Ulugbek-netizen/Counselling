import { describe, it, expect } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { SetupWizard } from "@/components/dashboard/setup-wizard";
import { vi } from "vitest";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }) }));
vi.mock("@/lib/supabase/client", () => ({ createClient: () => ({ from: () => ({ update: () => ({ eq: () => Promise.resolve({}) }), insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: {} }) }) }) }) }) }));

describe("SetupWizard", () => {
  it("renders step 1", () => {
    const { container } = render(<SetupWizard userId="test" />);
    expect(container.textContent).toContain("Preferred majors");
    expect(container.textContent).toContain("Step 1 of 4");
    cleanup();
  });

  it("navigates to step 2", () => {
    const { container } = render(<SetupWizard userId="test" />);
    const btns = container.querySelectorAll("button");
    const skipBtn = Array.from(btns).find(b => b.textContent?.includes("→"));
    fireEvent.click(skipBtn!);
    expect(container.textContent).toContain("Step 2 of 4");
    expect(container.textContent).toContain("countries");
    cleanup();
  });

  it("shows skip setup option", () => {
    const { container } = render(<SetupWizard userId="test" />);
    expect(container.textContent).toContain("Skip setup");
    cleanup();
  });
});
