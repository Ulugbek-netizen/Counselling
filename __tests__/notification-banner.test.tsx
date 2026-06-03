import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { NotificationBanner } from "@/components/dashboard/notification-banner";

describe("NotificationBanner", () => {
  const events = [
    { id: "1", label: "MIT deadline — 2 days", color: "#E74C3C" },
    { id: "2", label: "Session tomorrow", color: "#E8B86D" },
  ];

  it("renders events", () => {
    render(<NotificationBanner events={events} />);
    expect(screen.getByText("MIT deadline — 2 days")).toBeDefined();
    expect(screen.getByText("Session tomorrow")).toBeDefined();
    cleanup();
  });

  it("renders nothing when no events", () => {
    const { container } = render(<NotificationBanner events={[]} />);
    expect(container.innerHTML).toBe("");
    cleanup();
  });

  it("dismisses when close button clicked", () => {
    const { container } = render(<NotificationBanner events={events} />);
    const dismissBtn = container.querySelector('button[aria-label="Dismiss"]');
    expect(dismissBtn).not.toBeNull();
    fireEvent.click(dismissBtn!);
    expect(screen.queryByText("MIT deadline — 2 days")).toBeNull();
    cleanup();
  });
});
