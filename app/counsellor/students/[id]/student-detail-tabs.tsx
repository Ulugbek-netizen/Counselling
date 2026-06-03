"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";

/* eslint-disable @typescript-eslint/no-explicit-any */
function createClient() {
  return createSupabaseClient() as any;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StudentProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  birthday: string | null;
  grade: string | null;
  school_id: string | null;
}

interface Exam {
  id: string;
  student_id: string;
  exam_name: string;
  score: string | null;
  exam_date: string | null;
  status: "planned" | "taken";
  notes: string | null;
}

interface Application {
  id: string;
  student_id: string;
  university_id: string;
  application_type: string | null;
  status: string;
  deadline_date: string | null;
  progress_percent: number;
  university_name?: string;
  university_country?: string;
}

interface University {
  id: string;
  name: string;
  country: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TABS = ["Profile", "Applications", "Exams & Certificates", "Documents", "Essays"] as const;
type Tab = (typeof TABS)[number];

const EXAM_NAMES = ["SAT", "ACT", "IELTS", "TOEFL", "AP", "IB", "Other"];

const APP_TYPE_OPTIONS = [
  { value: "ea", label: "EA" },
  { value: "ed", label: "ED" },
  { value: "ed2", label: "ED2" },
  { value: "rea", label: "REA" },
  { value: "rd", label: "RD" },
  { value: "rolling", label: "Rolling" },
  { value: "other", label: "Other" },
];

const APP_STATUS_OPTIONS = [
  "considering",
  "active",
  "submitted",
  "accepted",
  "rejected",
  "waitlisted",
  "enrolled",
];

const APP_STATUS_STYLES: Record<string, string> = {
  considering: "bg-slate-100 text-slate-500",
  active: "bg-blue-50 text-status-blue",
  submitted: "bg-amber-50 text-status-amber",
  accepted: "bg-emerald-50 text-status-green",
  rejected: "bg-red-50 text-status-red",
  waitlisted: "bg-purple-50 text-purple-600",
  enrolled: "bg-emerald-100 text-emerald-700",
};

const APP_TYPE_STYLES: Record<string, string> = {
  ea: "bg-blue-50 text-status-blue",
  ed: "bg-purple-50 text-purple-600",
  ed2: "bg-purple-50 text-purple-600",
  rea: "bg-indigo-50 text-indigo-600",
  rd: "bg-slate-100 text-slate-500",
  rolling: "bg-amber-50 text-status-amber",
  other: "bg-gray-100 text-slate-500",
};

const FLAG_MAP: Record<string, string> = {
  US: "🇺🇸",
  UK: "🇬🇧",
  CA: "🇨🇦",
  AU: "🇦🇺",
  SG: "🇸🇬",
  CH: "🇨🇭",
  DE: "🇩🇪",
  FR: "🇫🇷",
  JP: "🇯🇵",
  KR: "🇰🇷",
  NL: "🇳🇱",
};

function countryFlag(country: string): string {
  // Try exact match first, then check if country string starts with a key
  if (FLAG_MAP[country]) return FLAG_MAP[country];
  for (const [code, flag] of Object.entries(FLAG_MAP)) {
    if (country.toLowerCase().startsWith(code.toLowerCase()) || country.toLowerCase().includes(code.toLowerCase())) {
      return flag;
    }
  }
  return "🌐";
}

// ---------------------------------------------------------------------------
// Toast banner
// ---------------------------------------------------------------------------

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div
      className={`text-xs px-3 py-2 rounded-lg mb-3 ${
        type === "success"
          ? "bg-emerald-50 text-status-green border border-emerald-200"
          : "bg-red-50 text-status-red border border-red-200"
      }`}
    >
      {msg}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Profile Tab
// ---------------------------------------------------------------------------

function ProfileTab({ student }: { student: StudentProfile }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState({
    first_name: student.first_name ?? "",
    last_name: student.last_name ?? "",
    email: student.email ?? "",
    phone: student.phone ?? "",
    birthday: student.birthday ?? "",
    grade: student.grade ?? "",
  });
  const [saved, setSaved] = useState({ ...form });

  function handleChange(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setToast(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: form.first_name || null,
        last_name: form.last_name || null,
        email: form.email || null,
        phone: form.phone || null,
        birthday: form.birthday || null,
        grade: form.grade || null,
      })
      .eq("id", student.id);

    if (error) {
      setToast({ msg: error.message, type: "error" });
    } else {
      setSaved({ ...form });
      setEditing(false);
      setToast({ msg: "Profile updated successfully.", type: "success" });
    }
    setSaving(false);
  }

  function handleCancel() {
    setForm({ ...saved });
    setEditing(false);
    setToast(null);
  }

  const fields: { label: string; key: keyof typeof form; type?: string }[] = [
    { label: "First name", key: "first_name" },
    { label: "Last name", key: "last_name" },
    { label: "Email", key: "email", type: "email" },
    { label: "Phone", key: "phone", type: "tel" },
    { label: "Date of birth", key: "birthday", type: "date" },
    { label: "Grade", key: "grade" },
  ];

  return (
    <div className="bg-white border border-cream-mid rounded-card p-6 max-w-xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-serif text-base text-navy">Student Profile</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-3 py-1.5 text-xs font-medium border border-cream-mid rounded-lg text-slate-500 hover:bg-cream transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <div className="space-y-4">
        {fields.map(({ label, key, type }) => (
          <div key={key} className="flex items-center gap-4">
            <label className="w-36 text-xs font-medium text-slate-400 flex-shrink-0">{label}</label>
            {editing ? (
              <input
                type={type ?? "text"}
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="flex-1 px-3 py-1.5 border border-cream-mid rounded-lg text-sm text-navy bg-white outline-none focus:border-navy transition-colors"
              />
            ) : (
              <span className="text-sm text-navy">
                {saved[key] || <span className="text-slate-300">—</span>}
              </span>
            )}
          </div>
        ))}
      </div>

      {editing && (
        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-navy text-white text-xs font-medium rounded-lg hover:bg-navy-mid transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-cream-mid text-xs font-medium rounded-lg text-slate-500 hover:bg-cream transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exams Tab
// ---------------------------------------------------------------------------

interface ExamRowProps {
  exam: Exam;
  onSave: (id: string, data: Partial<Exam>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function ExamRow({ exam, onSave, onDelete }: ExamRowProps) {
  const [editing, setEditing] = useState(false);
  const [deleteStep, setDeleteStep] = useState(0);
  const [form, setForm] = useState({
    exam_name: exam.exam_name,
    score: exam.score ?? "",
    exam_date: exam.exam_date ?? "",
    status: exam.status,
  });

  async function handleSave() {
    await onSave(exam.id, {
      exam_name: form.exam_name,
      score: form.score || null,
      exam_date: form.exam_date || null,
      status: form.status as Exam["status"],
    });
    setEditing(false);
  }

  function handleCancel() {
    setForm({
      exam_name: exam.exam_name,
      score: exam.score ?? "",
      exam_date: exam.exam_date ?? "",
      status: exam.status,
    });
    setEditing(false);
  }

  async function handleDeleteClick() {
    if (deleteStep === 0) {
      setDeleteStep(1);
    } else {
      await onDelete(exam.id);
    }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 border-b border-cream-mid last:border-b-0 bg-cream/30">
        <select
          value={form.exam_name}
          onChange={(e) => setForm((p) => ({ ...p, exam_name: e.target.value }))}
          className="w-28 px-2 py-1.5 border border-cream-mid rounded-lg text-xs text-navy bg-white outline-none focus:border-navy"
        >
          {EXAM_NAMES.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <input
          type="text"
          value={form.score}
          onChange={(e) => setForm((p) => ({ ...p, score: e.target.value }))}
          placeholder="Score"
          className="w-20 px-2 py-1.5 border border-cream-mid rounded-lg text-xs text-navy bg-white outline-none focus:border-navy"
        />
        <input
          type="date"
          value={form.exam_date}
          onChange={(e) => setForm((p) => ({ ...p, exam_date: e.target.value }))}
          className="w-32 px-2 py-1.5 border border-cream-mid rounded-lg text-xs text-navy bg-white outline-none focus:border-navy"
        />
        <select
          value={form.status}
          onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as Exam["status"] }))}
          className="w-24 px-2 py-1.5 border border-cream-mid rounded-lg text-xs text-navy bg-white outline-none focus:border-navy"
        >
          <option value="planned">Planned</option>
          <option value="taken">Taken</option>
        </select>
        <button onClick={handleSave} className="px-2.5 py-1 bg-navy text-white text-xs rounded-lg hover:bg-navy-mid">Save</button>
        <button onClick={handleCancel} className="px-2.5 py-1 border border-cream-mid text-xs rounded-lg text-slate-500 hover:bg-cream">Cancel</button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-cream-mid last:border-b-0 hover:bg-cream/30 transition-colors">
      <div className="flex-1 text-sm font-medium text-navy">{exam.exam_name}</div>
      <div className="w-16 text-sm text-slate-500">{exam.score ?? "—"}</div>
      <div className="w-24 text-xs text-slate-400">{exam.exam_date ?? "—"}</div>
      <div className="w-20">
        <span
          className={`text-[0.65rem] font-medium px-2 py-0.5 rounded-full ${
            exam.status === "taken"
              ? "bg-emerald-50 text-status-green"
              : "bg-blue-50 text-status-blue"
          }`}
        >
          {exam.status === "taken" ? "Taken" : "Planned"}
        </span>
      </div>
      <div className="flex gap-1.5">
        <button
          onClick={() => setEditing(true)}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-cream-mid text-slate-400 hover:bg-cream text-xs transition-colors"
          title="Edit"
        >
          ✏
        </button>
        <button
          onClick={handleDeleteClick}
          onBlur={() => setDeleteStep(0)}
          className={`px-2 h-7 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
            deleteStep === 1
              ? "bg-red-50 text-status-red border border-red-200"
              : "border border-cream-mid text-slate-400 hover:bg-red-50 hover:text-status-red"
          }`}
        >
          {deleteStep === 1 ? "Confirm?" : "✕"}
        </button>
      </div>
    </div>
  );
}

function ExamsTab({ studentId }: { studentId: string }) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [newExam, setNewExam] = useState({
    exam_name: "SAT",
    score: "",
    exam_date: "",
    status: "planned" as Exam["status"],
  });

  const fetchExams = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("student_exams")
      .select("id, student_id, exam_name, score, exam_date, status, notes")
      .eq("student_id", studentId)
      .order("exam_date", { ascending: false });

    if (!error && data) {
      setExams(data as Exam[]);
    }
    setLoading(false);
  }, [studentId]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  async function handleSave(id: string, updates: Partial<Exam>) {
    const supabase = createClient();
    const { error } = await supabase
      .from("student_exams")
      .update(updates)
      .eq("id", id);
    if (error) {
      setToast({ msg: error.message, type: "error" });
    } else {
      setToast({ msg: "Exam updated.", type: "success" });
      await fetchExams();
    }
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("student_exams")
      .delete()
      .eq("id", id);
    if (error) {
      setToast({ msg: error.message, type: "error" });
    } else {
      setToast({ msg: "Exam deleted.", type: "success" });
      await fetchExams();
    }
  }

  async function handleAddSave() {
    const supabase = createClient();
    const { error } = await supabase.from("student_exams").insert({
      student_id: studentId,
      exam_name: newExam.exam_name,
      score: newExam.score || null,
      exam_date: newExam.exam_date || null,
      status: newExam.status,
    });
    if (error) {
      setToast({ msg: error.message, type: "error" });
    } else {
      setToast({ msg: "Exam added.", type: "success" });
      setAdding(false);
      setNewExam({ exam_name: "SAT", score: "", exam_date: "", status: "planned" });
      await fetchExams();
    }
  }

  return (
    <div className="bg-white border border-cream-mid rounded-card overflow-hidden max-w-2xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-cream-mid">
        <h2 className="font-serif text-base text-navy">Exams & Certificates</h2>
        <button
          onClick={() => setAdding(true)}
          className="px-3 py-1.5 bg-navy text-white text-xs font-medium rounded-lg hover:bg-navy-mid transition-colors"
        >
          + Add exam
        </button>
      </div>

      {toast && (
        <div className="px-4 pt-3">
          <Toast msg={toast.msg} type={toast.type} />
        </div>
      )}

      {/* Column headers */}
      <div className="flex items-center gap-3 px-4 py-2 bg-cream border-b border-cream-mid">
        <div className="flex-1 text-[0.65rem] font-semibold tracking-wider uppercase text-slate-400">Exam</div>
        <div className="w-16 text-[0.65rem] font-semibold tracking-wider uppercase text-slate-400">Score</div>
        <div className="w-24 text-[0.65rem] font-semibold tracking-wider uppercase text-slate-400">Date</div>
        <div className="w-20 text-[0.65rem] font-semibold tracking-wider uppercase text-slate-400">Status</div>
        <div className="w-16" />
      </div>

      {loading ? (
        <div className="text-center text-sm text-slate-300 py-8">Loading…</div>
      ) : (
        <>
          {exams.map((exam) => (
            <ExamRow key={exam.id} exam={exam} onSave={handleSave} onDelete={handleDelete} />
          ))}
          {exams.length === 0 && !adding && (
            <div className="text-center text-sm text-slate-300 py-8">No exams yet</div>
          )}
        </>
      )}

      {/* Add exam inline form */}
      {adding && (
        <div className="flex items-center gap-2 px-4 py-3 border-t border-cream-mid bg-cream/30">
          <select
            value={newExam.exam_name}
            onChange={(e) => setNewExam((p) => ({ ...p, exam_name: e.target.value }))}
            className="w-28 px-2 py-1.5 border border-cream-mid rounded-lg text-xs text-navy bg-white outline-none focus:border-navy"
          >
            {EXAM_NAMES.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <input
            type="text"
            value={newExam.score}
            onChange={(e) => setNewExam((p) => ({ ...p, score: e.target.value }))}
            placeholder="Score"
            className="w-20 px-2 py-1.5 border border-cream-mid rounded-lg text-xs text-navy bg-white outline-none focus:border-navy"
          />
          <input
            type="date"
            value={newExam.exam_date}
            onChange={(e) => setNewExam((p) => ({ ...p, exam_date: e.target.value }))}
            className="w-32 px-2 py-1.5 border border-cream-mid rounded-lg text-xs text-navy bg-white outline-none focus:border-navy"
          />
          <select
            value={newExam.status}
            onChange={(e) => setNewExam((p) => ({ ...p, status: e.target.value as Exam["status"] }))}
            className="w-24 px-2 py-1.5 border border-cream-mid rounded-lg text-xs text-navy bg-white outline-none focus:border-navy"
          >
            <option value="planned">Planned</option>
            <option value="taken">Taken</option>
          </select>
          <button onClick={handleAddSave} className="px-2.5 py-1 bg-navy text-white text-xs rounded-lg hover:bg-navy-mid">Save</button>
          <button
            onClick={() => { setAdding(false); setNewExam({ exam_name: "SAT", score: "", exam_date: "", status: "planned" }); }}
            className="px-2.5 py-1 border border-cream-mid text-xs rounded-lg text-slate-500 hover:bg-cream"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Applications Tab
// ---------------------------------------------------------------------------

function ApplicationsTab({ studentId }: { studentId: string }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // University search
  const [uniSearch, setUniSearch] = useState("");
  const [uniResults, setUniResults] = useState<University[]>([]);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [appType, setAppType] = useState("rd");
  const [deadline, setDeadline] = useState("");

  const fetchApplications = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("applications")
      .select("id, student_id, university_id, application_type, status, deadline_date, progress_percent, universities(name, country)")
      .eq("student_id", studentId)
      .order("deadline_date", { ascending: true });

    if (!error && data) {
      const apps: Application[] = (data as Array<{
        id: string;
        student_id: string;
        university_id: string;
        application_type: string | null;
        status: string;
        deadline_date: string | null;
        progress_percent: number;
        universities: { name: string; country: string } | null;
      }>).map((a) => ({
        id: a.id,
        student_id: a.student_id,
        university_id: a.university_id,
        application_type: a.application_type,
        status: a.status,
        deadline_date: a.deadline_date,
        progress_percent: a.progress_percent ?? 0,
        university_name: a.universities?.name ?? "Unknown",
        university_country: a.universities?.country ?? "",
      }));
      setApplications(apps);
    }
    setLoading(false);
  }, [studentId]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  async function handleStatusChange(id: string, newStatus: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("id", id);
    if (error) {
      setToast({ msg: error.message, type: "error" });
    } else {
      await fetchApplications();
    }
  }

  async function searchUniversities(q: string) {
    if (!q.trim()) { setUniResults([]); return; }
    const supabase = createClient();
    const { data } = await supabase
      .from("universities")
      .select("id, name, country")
      .ilike("name", `%${q}%`)
      .limit(8);
    if (data) setUniResults(data as University[]);
  }

  async function handleAddSave() {
    if (!selectedUni) {
      setToast({ msg: "Please select a university.", type: "error" });
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.from("applications").insert({
      student_id: studentId,
      university_id: selectedUni.id,
      application_type: appType,
      deadline_date: deadline || null,
      status: "considering",
      progress_percent: 0,
    });
    if (error) {
      setToast({ msg: error.message, type: "error" });
    } else {
      setToast({ msg: "Application added.", type: "success" });
      setAdding(false);
      setUniSearch("");
      setUniResults([]);
      setSelectedUni(null);
      setAppType("rd");
      setDeadline("");
      await fetchApplications();
    }
  }

  return (
    <div className="bg-white border border-cream-mid rounded-card overflow-hidden max-w-3xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-cream-mid">
        <h2 className="font-serif text-base text-navy">Applications</h2>
        <button
          onClick={() => setAdding(true)}
          className="px-3 py-1.5 bg-navy text-white text-xs font-medium rounded-lg hover:bg-navy-mid transition-colors"
        >
          + Add application
        </button>
      </div>

      {toast && (
        <div className="px-4 pt-3">
          <Toast msg={toast.msg} type={toast.type} />
        </div>
      )}

      {/* Column headers */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_120px] px-4 py-2 bg-cream border-b border-cream-mid">
        <div className="text-[0.65rem] font-semibold tracking-wider uppercase text-slate-400">University</div>
        <div className="text-[0.65rem] font-semibold tracking-wider uppercase text-slate-400">Type</div>
        <div className="text-[0.65rem] font-semibold tracking-wider uppercase text-slate-400">Deadline</div>
        <div className="text-[0.65rem] font-semibold tracking-wider uppercase text-slate-400">Progress</div>
        <div className="text-[0.65rem] font-semibold tracking-wider uppercase text-slate-400">Status</div>
      </div>

      {loading ? (
        <div className="text-center text-sm text-slate-300 py-8">Loading…</div>
      ) : (
        <>
          {applications.map((app) => (
            <div
              key={app.id}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_120px] px-4 py-3 border-b border-cream-mid last:border-b-0 items-center hover:bg-cream/20"
            >
              <div className="text-sm font-medium text-navy truncate">
                {countryFlag(app.university_country ?? "")} {app.university_name}
              </div>
              <div>
                <span
                  className={`text-[0.65rem] font-medium px-2 py-0.5 rounded-full uppercase ${
                    APP_TYPE_STYLES[app.application_type ?? "other"] ?? "bg-gray-100 text-slate-500"
                  }`}
                >
                  {app.application_type?.toUpperCase() ?? "—"}
                </span>
              </div>
              <div className="text-xs text-slate-400">{app.deadline_date ?? "—"}</div>
              <div>
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 max-w-[60px] h-[5px] bg-cream-mid rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-navy"
                      style={{ width: `${app.progress_percent}%` }}
                    />
                  </div>
                  <span className="text-[0.65rem] text-slate-400">{app.progress_percent}%</span>
                </div>
              </div>
              <div>
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  className={`text-[0.65rem] font-medium px-2 py-0.5 rounded-full border-0 outline-none cursor-pointer ${
                    APP_STATUS_STYLES[app.status] ?? "bg-slate-100 text-slate-500"
                  }`}
                >
                  {APP_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          {applications.length === 0 && !adding && (
            <div className="text-center text-sm text-slate-300 py-8">No applications yet</div>
          )}
        </>
      )}

      {/* Add application inline form */}
      {adding && (
        <div className="px-4 py-4 border-t border-cream-mid bg-cream/20">
          <div className="text-xs font-semibold text-navy mb-3">Add Application</div>
          <div className="flex flex-wrap gap-2 mb-3">
            {/* University search */}
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                value={selectedUni ? selectedUni.name : uniSearch}
                onChange={(e) => {
                  if (selectedUni) { setSelectedUni(null); }
                  setUniSearch(e.target.value);
                  searchUniversities(e.target.value);
                }}
                placeholder="Search university…"
                className="w-full px-3 py-1.5 border border-cream-mid rounded-lg text-xs text-navy bg-white outline-none focus:border-navy"
              />
              {uniResults.length > 0 && !selectedUni && (
                <div className="absolute top-full left-0 right-0 z-20 bg-white border border-cream-mid rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {uniResults.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setSelectedUni(u);
                        setUniSearch(u.name);
                        setUniResults([]);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-navy hover:bg-cream border-b border-cream-mid last:border-b-0"
                    >
                      {countryFlag(u.country)} {u.name} <span className="text-slate-400">· {u.country}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <select
              value={appType}
              onChange={(e) => setAppType(e.target.value)}
              className="px-2 py-1.5 border border-cream-mid rounded-lg text-xs text-navy bg-white outline-none focus:border-navy"
            >
              {APP_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="px-2 py-1.5 border border-cream-mid rounded-lg text-xs text-navy bg-white outline-none focus:border-navy"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddSave}
              className="px-3 py-1.5 bg-navy text-white text-xs font-medium rounded-lg hover:bg-navy-mid transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setUniSearch("");
                setUniResults([]);
                setSelectedUni(null);
                setAppType("rd");
                setDeadline("");
              }}
              className="px-3 py-1.5 border border-cream-mid text-xs font-medium rounded-lg text-slate-500 hover:bg-cream transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Placeholder tabs
// ---------------------------------------------------------------------------

function PlaceholderTab({ label }: { label: string }) {
  return (
    <div className="bg-white border border-cream-mid rounded-card p-8 text-center text-sm text-slate-300 max-w-2xl">
      {label} — coming soon
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main StudentDetailTabs
// ---------------------------------------------------------------------------

export function StudentDetailTabs({ student }: { student: StudentProfile }) {
  const [activeTab, setActiveTab] = useState<Tab>("Profile");

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-5 border-b border-cream-mid">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-navy text-navy"
                : "border-transparent text-slate-400 hover:text-navy"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Profile" && <ProfileTab student={student} />}
      {activeTab === "Applications" && <ApplicationsTab studentId={student.id} />}
      {activeTab === "Exams & Certificates" && <ExamsTab studentId={student.id} />}
      {activeTab === "Documents" && <PlaceholderTab label="Documents" />}
      {activeTab === "Essays" && <PlaceholderTab label="Essays" />}
    </div>
  );
}
