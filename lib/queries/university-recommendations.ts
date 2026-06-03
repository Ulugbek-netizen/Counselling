import type { SupabaseClient } from "@supabase/supabase-js";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Client = SupabaseClient<any, any, any>;

export interface RecommendedUni {
  id: string; name: string; country: string; city: string;
  matchScore: number; matchReasons: string[];
}

export async function getRecommendations(
  supabase: Client, userId: string
): Promise<RecommendedUni[]> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("preferred_majors, preferred_countries, budget_range")
    .eq("id", userId)
    .single();

  if (!profile) return [];
  const prefMajors: string[] = profile.preferred_majors ?? [];
  const prefCountries: string[] = profile.preferred_countries ?? [];
  const budget = profile.budget_range;

  if (prefMajors.length === 0 && prefCountries.length === 0) return [];

  const { data: universities } = await supabase.from("universities").select("id, name, country, city, tuition_international");
  if (!universities) return [];

  // Get programs for matching
  const uniIds = universities.map((u: any) => u.id);
  const { data: programs } = await supabase.from("university_programs").select("university_id, name").in("university_id", uniIds.length > 0 ? uniIds : ["none"]);
  const programsByUni = new Map<string, string[]>();
  for (const p of (programs ?? [])) {
    if (!programsByUni.has(p.university_id)) programsByUni.set(p.university_id, []);
    programsByUni.get(p.university_id)!.push(p.name);
  }

  // Get student's exams
  const { data: exams } = await supabase.from("student_exams").select("exam_name, score").eq("student_id", userId).eq("status", "taken");
  const examMap = new Map<string, string>((exams ?? []).map((e: any) => [e.exam_name.toLowerCase(), e.score]));

  // Get requirements
  const { data: reqs } = await supabase.from("university_requirements").select("university_id, exam_name, minimum_score");
  const reqsByUni = new Map<string, any[]>();
  for (const r of (reqs ?? [])) {
    if (!reqsByUni.has(r.university_id)) reqsByUni.set(r.university_id, []);
    reqsByUni.get(r.university_id)!.push(r);
  }

  // Already bookmarked
  const { data: bookmarks } = await supabase.from("university_bookmarks").select("university_id").eq("student_id", userId);
  const bookmarkedIds = new Set((bookmarks ?? []).map((b: any) => b.university_id));

  const scored: RecommendedUni[] = [];

  for (const uni of universities) {
    if (bookmarkedIds.has(uni.id)) continue;

    let score = 0;
    const reasons: string[] = [];

    // Country match
    if (prefCountries.includes(uni.country)) { score += 30; reasons.push(`Country match: ${uni.country}`); }

    // Major match
    const uniPrograms = programsByUni.get(uni.id) ?? [];
    const matchingMajors = prefMajors.filter(m => uniPrograms.some(p => p.toLowerCase().includes(m.toLowerCase())));
    if (matchingMajors.length > 0) { score += 30; reasons.push(`Major match: ${matchingMajors.join(", ")}`); }

    // Budget match
    const tuition = uni.tuition_international;
    if (budget && tuition) {
      const budgetMap: Record<string, number> = { "Under $15k": 15000, "$15k–$30k": 30000, "$30k–$50k": 50000, "$50k+": 999999 };
      const maxBudget = budgetMap[budget] ?? 999999;
      if (tuition <= maxBudget) { score += 15; reasons.push("Within budget"); }
    }

    // Exam score match
    const uniReqs = reqsByUni.get(uni.id) ?? [];
    let meetsAll = true;
    for (const req of uniReqs) {
      const studentScore = examMap.get(req.exam_name.toLowerCase());
      if (studentScore && req.minimum_score) {
        if (parseFloat(studentScore) >= parseFloat(req.minimum_score)) { score += 10; }
        else meetsAll = false;
      }
    }
    if (uniReqs.length > 0 && meetsAll) reasons.push("Meets exam requirements");

    if (score >= 30) {
      scored.push({ id: uni.id, name: uni.name, country: uni.country, city: uni.city, matchScore: Math.min(score, 100), matchReasons: reasons });
    }
  }

  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 10);
}
