import { describe, it, expect } from "vitest";
import type {
  UserRole,
  School,
  Profile,
  University,
  Application,
  ApplicationStatus,
  Database,
} from "@/types/database";

describe("Database types", () => {
  it("defines all four user roles", () => {
    const roles: UserRole[] = [
      "platform_admin",
      "school_admin",
      "counsellor",
      "student",
    ];
    expect(roles).toHaveLength(4);
    expect(roles).toContain("platform_admin");
    expect(roles).toContain("student");
  });

  it("defines complete application status lifecycle", () => {
    const statuses: ApplicationStatus[] = [
      "considering",
      "active",
      "submitted",
      "accepted",
      "rejected",
      "waitlisted",
      "enrolled",
    ];
    expect(statuses).toHaveLength(7);
  });

  it("School type includes subscription fields", () => {
    const school: School = {
      id: "test-id",
      name: "Test School",
      country: "US",
      city: "New York",
      address: null,
      logo_url: null,
      website: null,
      subscription_tier: "starter",
      subscription_status: "active",
      stripe_customer_id: null,
      stripe_subscription_id: null,
      max_students: 50,
      max_counsellors: 3,
      grace_period_ends_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    expect(school.subscription_tier).toBe("starter");
    expect(school.max_students).toBe(50);
  });

  it("Profile type includes role and school isolation", () => {
    const profile: Profile = {
      id: "user-id",
      school_id: "school-id",
      role: "student",
      first_name: "Aisha",
      last_name: "Demberel",
      email: "aisha@school.edu",
      avatar_url: null,
      birthday: "2008-06-15",
      grade: "11",
      title: null,
      department: null,
      phone: null,
      show_as_counsellor: true,
      preferred_majors: ["Architecture", "Business Administration"],
      preferred_countries: ["US", "UK"],
      budget_range: "$30k-$50k",
      setup_completed: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    expect(profile.school_id).toBe("school-id");
    expect(profile.role).toBe("student");
    expect(profile.preferred_majors).toContain("Architecture");
  });

  it("University type includes international-specific fields", () => {
    const uni: University = {
      id: "uni-id",
      name: "MIT",
      country: "US",
      city: "Cambridge",
      website: "https://mit.edu",
      type: "Private",
      tagline: "World-leading STEM university",
      description: null,
      tuition_international: 57590,
      tuition_currency: "USD",
      acceptance_rate_international: 3.2,
      logo_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    expect(uni.tuition_international).toBe(57590);
    expect(uni.acceptance_rate_international).toBe(3.2);
  });

  it("Application type supports full lifecycle with scholarship unlock", () => {
    const app: Application = {
      id: "app-id",
      student_id: "student-id",
      university_id: "uni-id",
      bookmark_id: null,
      application_type: "ea",
      status: "accepted",
      deadline_date: "2026-11-01",
      submitted_at: "2026-10-30T00:00:00Z",
      decision_date: "2026-12-15",
      decision_received_at: "2026-12-15T00:00:00Z",
      notes: null,
      progress_percent: 100,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    expect(app.status).toBe("accepted");
    expect(app.progress_percent).toBe(100);
  });

  it("Database type includes all core tables", () => {
    type TableNames = keyof Database["public"]["Tables"];
    const tables: TableNames[] = [
      "schools",
      "profiles",
      "universities",
      "applications",
      "essays",
      "student_exams",
      "sessions",
      "documents",
      "scholarships",
      "programs",
      "notifications",
    ];
    expect(tables.length).toBeGreaterThanOrEqual(11);
  });
});
