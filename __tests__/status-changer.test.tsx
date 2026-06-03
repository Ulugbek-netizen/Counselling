import { describe, it, expect } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { ApplicationStatusChanger } from "@/components/dashboard/application-status-changer";
import { vi } from "vitest";

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({ from: () => ({ update: () => ({ eq: () => Promise.resolve({}) }) }) }),
}));

describe("ApplicationStatusChanger", () => {
  it("displays current status as badge", () => {
    const { container } = render(<ApplicationStatusChanger applicationId="1" currentStatus="active" canEdit={false} />);
    expect(container.textContent).toContain("Active");
    cleanup();
  });

  it("shows dropdown when editable and clicked", () => {
    const { container } = render(<ApplicationStatusChanger applicationId="1" currentStatus="active" canEdit={true} />);
    const btn = container.querySelector("button")!;
    fireEvent.click(btn);
    expect(container.textContent).toContain("Submitted");
    expect(container.textContent).toContain("Accepted");
    expect(container.textContent).toContain("Enrolled");
    cleanup();
  });

  it("shows all 7 statuses in dropdown", () => {
    const { container } = render(<ApplicationStatusChanger applicationId="1" currentStatus="considering" canEdit={true} />);
    fireEvent.click(container.querySelector("button")!);
    const buttons = container.querySelectorAll("button");
    // 1 trigger + 7 options = 8 buttons
    expect(buttons.length).toBe(8);
    cleanup();
  });
});
