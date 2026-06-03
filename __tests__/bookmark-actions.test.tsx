import { describe, it, expect } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { BookmarkActions } from "@/components/universities/bookmark-actions";
import { vi } from "vitest";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }) }));
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: { getUser: () => Promise.resolve({ data: { user: { id: "test" } } }) },
    from: () => ({ insert: () => Promise.resolve({}), delete: () => ({ eq: () => Promise.resolve({}) }), update: () => ({ eq: () => Promise.resolve({}) }) }),
  }),
}));

describe("BookmarkActions", () => {
  it("shows 'Add to my list' when not bookmarked", () => {
    const { container } = render(<BookmarkActions universityId="1" universityName="MIT" bookmarkStatus="none" bookmarkId={null} />);
    expect(container.textContent).toContain("Add to my list");
    cleanup();
  });

  it("shows 'Considering' and 'Apply' when bookmarked", () => {
    const { container } = render(<BookmarkActions universityId="1" universityName="MIT" bookmarkStatus="considering" bookmarkId="b1" />);
    expect(container.textContent).toContain("Considering");
    expect(container.textContent).toContain("Apply to this university");
    cleanup();
  });

  it("shows confirmation dialog when Apply clicked", () => {
    const { container } = render(<BookmarkActions universityId="1" universityName="MIT" bookmarkStatus="considering" bookmarkId="b1" />);
    const applyBtn = container.querySelector("button:nth-of-type(1)")!;
    fireEvent.click(applyBtn);
    expect(container.textContent).toContain("Start application?");
    expect(container.textContent).toContain("deadline tracking");
    cleanup();
  });

  it("shows 'Active application' for active status", () => {
    const { container } = render(<BookmarkActions universityId="1" universityName="MIT" bookmarkStatus="active" bookmarkId="b1" />);
    expect(container.textContent).toContain("Active application");
    cleanup();
  });
});
