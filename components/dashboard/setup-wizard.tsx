"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Props { userId: string; }

const STEPS = ["Preferred majors", "Preferred countries", "Exam scores", "Budget range"];

export function SetupWizard({ userId }: Props) {
  const [step, setStep] = useState(0);
  const [majors, setMajors] = useState<string[]>([]);
  const [majorInput, setMajorInput] = useState("");
  const [countries, setCountries] = useState<string[]>([]);
  const [countryInput, setCountryInput] = useState("");
  const [exams, setExams] = useState<{ name: string; score: string }[]>([]);
  const [budget, setBudget] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const inputClass = "w-full px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy bg-white outline-none focus:border-navy transition-colors";

  function addMajor() {
    if (majorInput.trim() && !majors.includes(majorInput.trim())) {
      setMajors([...majors, majorInput.trim()]);
      setMajorInput("");
    }
  }

  function addCountry() {
    if (countryInput.trim() && !countries.includes(countryInput.trim())) {
      setCountries([...countries, countryInput.trim()]);
      setCountryInput("");
    }
  }

  function addExam() {
    setExams([...exams, { name: "", score: "" }]);
  }

  async function handleFinish() {
    setSaving(true);
    const supabase = createClient() as any;

    await supabase.from("profiles").update({
      preferred_majors: majors.length > 0 ? majors : null,
      preferred_countries: countries.length > 0 ? countries : null,
      budget_range: budget || null,
      setup_completed: true,
    }).eq("id", userId);

    // Save exams
    for (const e of exams) {
      if (e.name) {
        await supabase.from("student_exams").insert({
          student_id: userId,
          exam_name: e.name,
          score: e.score || null,
          status: "taken",
        });
      }
    }

    setSaving(false);
    router.refresh();
  }

  async function handleSkipAll() {
    const supabase = createClient() as any;
    await supabase.from("profiles").update({ setup_completed: true }).eq("id", userId);
    router.refresh();
  }

  return (
    <div className="fixed inset-0 bg-navy/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-card w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-navy px-6 py-5 relative overflow-hidden">
          <div className="absolute top-[-60px] right-[-60px] w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(201,147,58,0.1)_0%,transparent_65%)]" />
          <h2 className="font-serif text-xl text-white relative z-10">Welcome to Edu<span className="text-gold">Path</span></h2>
          <p className="text-sm text-white/40 mt-1 relative z-10">Help us personalise your experience. All fields are optional.</p>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4 flex gap-1">
          {STEPS.map((s, i) => (
            <div key={s} className={`flex-1 h-1 rounded-full transition-colors ${i <= step ? "bg-gold" : "bg-cream-mid"}`} />
          ))}
        </div>
        <div className="px-6 pt-2 pb-1 text-[0.7rem] text-slate-400">Step {step + 1} of {STEPS.length} — {STEPS[step]}</div>

        {/* Content */}
        <div className="px-6 py-4 min-h-[200px]">
          {step === 0 && (
            <div>
              <p className="text-sm text-slate-500 mb-3">What majors are you interested in? Type specific names.</p>
              <div className="flex gap-2 mb-3">
                <input value={majorInput} onChange={e => setMajorInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addMajor())} className={inputClass} placeholder="Architecture, Computer Science, Business Admin…" />
                <button onClick={addMajor} className="px-3 py-2 bg-navy text-white rounded-lg text-xs font-medium flex-shrink-0">Add</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {majors.map(m => (
                  <span key={m} className="bg-blue-50 text-status-blue text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    {m}
                    <button onClick={() => setMajors(majors.filter(x => x !== m))} className="text-status-blue/50 hover:text-status-blue">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="text-sm text-slate-500 mb-3">Which countries are you interested in studying in?</p>
              <div className="flex gap-2 mb-3">
                <input value={countryInput} onChange={e => setCountryInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCountry())} className={inputClass} placeholder="USA, UK, Canada, Switzerland…" />
                <button onClick={addCountry} className="px-3 py-2 bg-navy text-white rounded-lg text-xs font-medium flex-shrink-0">Add</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {countries.map(c => (
                  <span key={c} className="bg-emerald-50 text-status-green text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    {c}
                    <button onClick={() => setCountries(countries.filter(x => x !== c))} className="text-status-green/50 hover:text-status-green">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-sm text-slate-500 mb-3">Add any exams you've already taken with scores.</p>
              <button onClick={addExam} className="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium mb-3">+ Add exam</button>
              {exams.map((e, i) => (
                <div key={i} className="grid grid-cols-2 gap-2 mb-2">
                  <input value={e.name} onChange={ev => { const c = [...exams]; c[i].name = ev.target.value; setExams(c); }} className={inputClass} placeholder="SAT, IELTS, TOEFL…" />
                  <input value={e.score} onChange={ev => { const c = [...exams]; c[i].score = ev.target.value; setExams(c); }} className={inputClass} placeholder="Score (e.g. 1520)" />
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="text-sm text-slate-500 mb-3">What's your approximate annual tuition budget?</p>
              <div className="space-y-2">
                {["Under $15k", "$15k–$30k", "$30k–$50k", "$50k+", "No preference"].map(opt => (
                  <label key={opt} className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${budget === opt ? "border-gold bg-gold/5" : "border-cream-mid hover:bg-cream"}`}>
                    <input type="radio" name="budget" checked={budget === opt} onChange={() => setBudget(opt)} className="accent-gold" />
                    <span className="text-sm text-navy">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-cream-mid flex items-center justify-between">
          <button onClick={handleSkipAll} className="text-xs text-slate-400 hover:text-navy transition-colors">Skip setup</button>
          <div className="flex gap-2">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="px-4 py-2 border border-cream-mid rounded-lg text-sm text-slate-500 hover:bg-cream transition-colors">Back</button>
            )}
            {step < 3 ? (
              <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-mid transition-colors">
                {step === 0 && majors.length === 0 || step === 1 && countries.length === 0 || step === 2 && exams.length === 0 ? "Skip" : "Next"} →
              </button>
            ) : (
              <button onClick={handleFinish} disabled={saving} className="px-6 py-2 bg-gold text-white rounded-lg text-sm font-medium hover:bg-gold/90 transition-colors disabled:opacity-50">
                {saving ? "Saving…" : "Finish setup ✓"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
