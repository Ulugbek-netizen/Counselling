import { describe, it, expect } from "vitest";
import { getRedirectPath, isPublicPath, getRoleDashboardLabel } from "@/lib/utils/auth";

describe("Auth routing logic", () => {
  it("routes platform_admin to /admin", () => {
    expect(getRedirectPath("platform_admin")).toBe("/admin");
  });

  it("routes school_admin to /counsellor", () => {
    expect(getRedirectPath("school_admin")).toBe("/counsellor");
  });

  it("routes counsellor to /counsellor", () => {
    expect(getRedirectPath("counsellor")).toBe("/counsellor");
  });

  it("routes student to /student", () => {
    expect(getRedirectPath("student")).toBe("/student");
  });

  it("identifies public paths correctly", () => {
    expect(isPublicPath("/")).toBe(true);
    expect(isPublicPath("/sign-in")).toBe(true);
    expect(isPublicPath("/demo")).toBe(true);
    expect(isPublicPath("/admin")).toBe(false);
    expect(isPublicPath("/counsellor")).toBe(false);
    expect(isPublicPath("/student")).toBe(false);
  });

  it("does not treat partial matches as public", () => {
    expect(isPublicPath("/sign-in/reset")).toBe(false);
    expect(isPublicPath("/demo/something")).toBe(false);
  });

  it("provides human-readable role labels", () => {
    expect(getRoleDashboardLabel("platform_admin")).toBe("Platform Admin");
    expect(getRoleDashboardLabel("school_admin")).toBe("School Admin");
    expect(getRoleDashboardLabel("counsellor")).toBe("Counsellor");
    expect(getRoleDashboardLabel("student")).toBe("Student");
  });
});
