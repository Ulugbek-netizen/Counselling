import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const s = supabase as any;
  const { data: profile } = await s.from("profiles").select("role, school_id").eq("id", user.id).single();
  if (!profile || !["school_admin", "platform_admin"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const schoolId = profile.school_id;
  const query = schoolId
    ? s.from("profiles").select("first_name, last_name, email, grade, role, preferred_majors, preferred_countries, budget_range, created_at").eq("school_id", schoolId).eq("role", "student")
    : s.from("profiles").select("first_name, last_name, email, grade, role, school_id, preferred_majors, preferred_countries, budget_range, created_at").eq("role", "student");

  const { data: students } = await query.order("last_name");

  if (!students || students.length === 0) {
    return new NextResponse("No students found", { status: 200, headers: { "Content-Type": "text/plain" } });
  }

  // Build CSV
  const headers = Object.keys(students[0]);
  const rows = students.map((s: Record<string, unknown>) =>
    headers.map(h => {
      const val = s[h];
      if (val === null || val === undefined) return "";
      if (Array.isArray(val)) return `"${val.join(", ")}"`;
      const str = String(val);
      return str.includes(",") || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
    }).join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="students_export_${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
