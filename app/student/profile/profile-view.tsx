"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Exam {
  id: string;
  exam_name: string;
  exam_date: string | null;
  score: string | null;
  status: "planned" | "taken";
}

interface Props {
  profile: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    birthday: string | null;
    grade: string | null;
    preferred_majors: string[] | null;
    preferred_countries: string[] | null;
    budget_range: string | null;
    setup_completed: boolean;
  };
  exams: Exam[];
}

export function ProfileView({ profile, exams: initialExams }: Props) {
  const [exams, setExams] = useState(initialExams);
  const [showAddExam, setShowAddExam] = useState(false);
  const [newExamName, setNewExamName] = useState("");
  const [newExamDate, setNewExamDate] = useState("");
  const [newExamScore, setNewExamScore] = useState("");
  const [newExamStatus, setNewExamStatus] = useState<"planned" | "taken">("planned");
  const [saving, setSaving] = useState(false);

  const inputClass = "w-full px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy bg-white outline-none focus:border-navy transition-colors";

  // Completion calculation
  const fields = [profile.first_name, profile.grade, profile.preferred_majors?.length, profile.preferred_countries?.length, exams.length > 0];
  const filled = fields.filter(Boolean).length;
  const completionPercent = Math.round((filled / fields.length) * 100);

  async function handleAddExam() {
    if (!newExamName) return;
    setSaving(true);
    const supabase = createClient() as any;
    const { data, error } = await supabase.from("student_exams").insert({
      student_id: profile.id,
      exam_name: newExamName,
      exam_date: newExamDate || null,
      score: newExamScore || null,
      status: newExamStatus,
    }).select().single();

    if (!error && data) {
      setExams([...exams, data]);
      setNewExamName(""); setNewExamDate(""); setNewExamScore("");
      setShowAddExam(false);
    }
    setSaving(false);
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Completion bar */}
      <div className="bg-white border border-cream-mid rounded-card p-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-500">Profile completion</span>
            <span className="text-xs font-semibold text-navy">{completionPercent}%</span>
          </div>
          <div className="w-full h-2 bg-cream-mid rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${completionPercent}%` }} />
          </div>
        </div>
        {completionPercent < 100 && (
          <span className="text-[0.7rem] text-slate-400">Complete your profile for better recommendations</span>
        )}
      </div>

      {/* Personal info (read-only for student) */}
      <div className="bg-white border border-cream-mid rounded-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-navy">Personal information</h3>
          <span className="text-[0.68rem] text-slate-400 bg-cream px-2 py-0.5 rounded">Managed by counsellor</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs font-medium text-slate-400 mb-1">First name</label><input value={profile.first_name ?? ""} disabled className={inputClass + " opacity-50"} /></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1">Last name</label><input value={profile.last_name ?? ""} disabled className={inputClass + " opacity-50"} /></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1">Email</label><input value={profile.email ?? ""} disabled className={inputClass + " opacity-50"} /></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1">Grade</label><input value={profile.grade ?? ""} disabled className={inputClass + " opacity-50"} /></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1">Birthday</label><input value={profile.birthday ?? ""} disabled className={inputClass + " opacity-50"} /></div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white border border-cream-mid rounded-card p-6">
        <h3 className="font-serif text-lg text-navy mb-4">Preferences</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Preferred majors</label>
            <div className="flex flex-wrap gap-1.5">
              {profile.preferred_majors?.map((m) => (
                <span key={m} className="bg-blue-50 text-status-blue text-xs px-2 py-0.5 rounded-full">{m}</span>
              )) ?? <span className="text-xs text-slate-300">Not set</span>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Preferred countries</label>
            <div className="flex flex-wrap gap-1.5">
              {profile.preferred_countries?.map((c) => (
                <span key={c} className="bg-emerald-50 text-status-green text-xs px-2 py-0.5 rounded-full">{c}</span>
              )) ?? <span className="text-xs text-slate-300">Not set</span>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Budget range</label>
            <span className="text-sm text-navy">{profile.budget_range ?? "Not set"}</span>
          </div>
        </div>
      </div>

      {/* Exams */}
      <div className="bg-white border border-cream-mid rounded-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-navy">Exams &amp; test scores</h3>
          <button onClick={() => setShowAddExam(true)} className="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium hover:bg-navy-mid transition-colors">
            + Add exam
          </button>
        </div>

        {showAddExam && (
          <div className="border border-gold/30 bg-gold/5 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="col-span-2"><label className="block text-xs font-medium text-slate-500 mb-1">Exam name</label><input value={newExamName} onChange={e => setNewExamName(e.target.value)} className={inputClass} placeholder="SAT, IELTS, Cambridge..." /></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Date</label><input type="date" value={newExamDate} onChange={e => setNewExamDate(e.target.value)} className={inputClass} /></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Score (optional)</label><input value={newExamScore} onChange={e => setNewExamScore(e.target.value)} className={inputClass} placeholder="1520" /></div>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <label className="flex items-center gap-2 text-sm text-slate-500">
                <input type="radio" name="examStatus" checked={newExamStatus === "planned"} onChange={() => setNewExamStatus("planned")} /> Planned
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-500">
                <input type="radio" name="examStatus" checked={newExamStatus === "taken"} onChange={() => setNewExamStatus("taken")} /> Taken
              </label>
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddExam} disabled={saving || !newExamName} className="px-3 py-1.5 bg-gold text-white rounded-lg text-xs font-medium disabled:opacity-50">{saving ? "Saving..." : "Save exam"}</button>
              <button onClick={() => setShowAddExam(false)} className="px-3 py-1.5 border border-cream-mid rounded-lg text-xs text-slate-500">Cancel</button>
            </div>
          </div>
        )}

        {exams.length > 0 ? (
          <div className="space-y-2">
            {exams.map((exam) => (
              <div key={exam.id} className="flex items-center gap-3 px-3 py-2.5 bg-cream rounded-lg">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${exam.status === "taken" ? "bg-status-green" : "bg-status-purple"}`} />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-navy">{exam.exam_name}</span>
                  {exam.exam_date && <span className="text-xs text-slate-400 ml-2">{exam.exam_date}</span>}
                </div>
                {exam.score && <span className="text-sm font-semibold text-navy">{exam.score}</span>}
                <span className={`text-[0.65rem] font-medium px-1.5 py-0.5 rounded-full ${exam.status === "taken" ? "bg-emerald-50 text-status-green" : "bg-purple-50 text-status-purple"}`}>
                  {exam.status === "taken" ? "Taken" : "Planned"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-300 text-center py-6">No exams added yet. Add your planned or completed exams above.</p>
        )}
      </div>
    </div>
  );
}
