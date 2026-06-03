"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ProgramEntry { name: string; degreeType: string; schoolFaculty: string; durationYears: string; durationSemesters: string; isDoubleDegree: boolean; isMultiCampus: boolean; multiCampusDetails: string; }
interface RequirementEntry { examName: string; minimumScore: string; avgAdmittedScore: string; isRequired: boolean; }
interface DeadlineEntry { applicationType: string; deadlineDate: string; decisionDate: string; notes: string; }
interface PathwayEntry { platformName: string; url: string; fee: string; feeCurrency: string; feeWaiverAvailable: boolean; applicablePrograms: string; adminTips: string; }
interface FeatureEntry { title: string; description: string; }

const STEPS = ["Basic info", "Programs", "Requirements", "Deadlines", "Application pathways", "Special features", "Review"];

export function UniversityForm() {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Basic info
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");
  const [uniType, setUniType] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [tuition, setTuition] = useState("");
  const [tuitionCurrency, setTuitionCurrency] = useState("USD");
  const [acceptanceRate, setAcceptanceRate] = useState("");

  // Programs
  const [programs, setPrograms] = useState<ProgramEntry[]>([]);

  // Requirements
  const [requirements, setRequirements] = useState<RequirementEntry[]>([]);

  // Deadlines
  const [deadlines, setDeadlines] = useState<DeadlineEntry[]>([]);

  // Pathways
  const [pathways, setPathways] = useState<PathwayEntry[]>([]);

  // Features
  const [features, setFeatures] = useState<FeatureEntry[]>([]);

  function addProgram() {
    setPrograms([...programs, { name: "", degreeType: "Bachelor of Science", schoolFaculty: "", durationYears: "4", durationSemesters: "8", isDoubleDegree: false, isMultiCampus: false, multiCampusDetails: "" }]);
  }

  function addRequirement() {
    setRequirements([...requirements, { examName: "", minimumScore: "", avgAdmittedScore: "", isRequired: true }]);
  }

  function addDeadline() {
    setDeadlines([...deadlines, { applicationType: "rd", deadlineDate: "", decisionDate: "", notes: "" }]);
  }

  function addPathway() {
    setPathways([...pathways, { platformName: "", url: "", fee: "", feeCurrency: "USD", feeWaiverAvailable: false, applicablePrograms: "", adminTips: "" }]);
  }

  function addFeature() {
    setFeatures([...features, { title: "", description: "" }]);
  }

  function updateProgram(i: number, field: string, value: string | boolean) {
    const copy = [...programs];
    (copy[i] as any)[field] = value;
    setPrograms(copy);
  }

  function updateRequirement(i: number, field: string, value: string | boolean) {
    const copy = [...requirements];
    (copy[i] as any)[field] = value;
    setRequirements(copy);
  }

  function updateDeadline(i: number, field: string, value: string) {
    const copy = [...deadlines];
    (copy[i] as any)[field] = value;
    setDeadlines(copy);
  }

  function updatePathway(i: number, field: string, value: string | boolean) {
    const copy = [...pathways];
    (copy[i] as any)[field] = value;
    setPathways(copy);
  }

  function updateFeature(i: number, field: string, value: string) {
    const copy = [...features];
    (copy[i] as any)[field] = value;
    setFeatures(copy);
  }

  async function handleSave() {
    setSaving(true);
    const supabase = createClient() as any;

    // Insert university
    const { data: uni, error } = await supabase.from("universities").insert({
      name, country, city, website: website || null, type: uniType || null,
      tagline: tagline || null, description: description || null,
      tuition_international: tuition ? parseFloat(tuition) : null,
      tuition_currency: tuitionCurrency,
      acceptance_rate_international: acceptanceRate ? parseFloat(acceptanceRate) : null,
    }).select("id").single();

    if (error || !uni) { setSaving(false); alert("Error saving university"); return; }

    const uniId = uni.id;

    // Insert programs
    if (programs.length > 0) {
      await supabase.from("university_programs").insert(
        programs.filter(p => p.name).map(p => ({
          university_id: uniId, name: p.name, degree_type: p.degreeType || null,
          school_faculty: p.schoolFaculty || null,
          duration_years: p.durationYears ? parseInt(p.durationYears) : null,
          duration_semesters: p.durationSemesters ? parseInt(p.durationSemesters) : null,
          is_double_degree: p.isDoubleDegree, is_multi_campus: p.isMultiCampus,
          multi_campus_details: p.multiCampusDetails || null,
        }))
      );
    }

    // Insert requirements
    if (requirements.length > 0) {
      await supabase.from("university_requirements").insert(
        requirements.filter(r => r.examName).map(r => ({
          university_id: uniId, exam_name: r.examName,
          minimum_score: r.minimumScore || null, average_admitted_score: r.avgAdmittedScore || null,
          is_required: r.isRequired,
        }))
      );
    }

    // Insert deadlines
    if (deadlines.length > 0) {
      await supabase.from("university_deadlines").insert(
        deadlines.filter(d => d.deadlineDate).map(d => ({
          university_id: uniId, application_type: d.applicationType,
          deadline_date: d.deadlineDate, decision_date: d.decisionDate || null,
          notes: d.notes || null,
        }))
      );
    }

    // Insert pathways
    if (pathways.length > 0) {
      await supabase.from("university_pathways").insert(
        pathways.filter(p => p.platformName).map(p => ({
          university_id: uniId, platform_name: p.platformName,
          url: p.url || null, fee: p.fee ? parseFloat(p.fee) : null,
          fee_currency: p.feeCurrency, fee_waiver_available: p.feeWaiverAvailable,
          applicable_programs: p.applicablePrograms || null,
          admin_tips: p.adminTips || null,
        }))
      );
    }

    // Insert features
    if (features.length > 0) {
      await supabase.from("university_features").insert(
        features.filter(f => f.title).map(f => ({
          university_id: uniId, title: f.title, description: f.description || null,
        }))
      );
    }

    setSaving(false);
    setSaved(true);
  }

  const inputClass = "w-full px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy bg-white outline-none focus:border-navy transition-colors";
  const labelClass = "block text-xs font-medium text-slate-500 mb-1";

  return (
    <div className="max-w-3xl">
      {saved ? (
        <div className="bg-white border border-cream-mid rounded-card p-8 text-center">
          <div className="text-3xl mb-3">✓</div>
          <div className="font-serif text-xl text-navy mb-2">University saved</div>
          <p className="text-sm text-slate-400 mb-4">{name} has been added to the database.</p>
          <button onClick={() => { setSaved(false); setStep(0); setName(""); setCountry(""); setCity(""); setPrograms([]); setRequirements([]); setDeadlines([]); setPathways([]); setFeatures([]); }} className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-mid transition-colors">
            Add another university
          </button>
        </div>
      ) : (
        <>
          {/* Progress steps */}
          <div className="flex gap-1 mb-6">
            {STEPS.map((s, i) => (
              <button key={s} onClick={() => setStep(i)} className={`flex-1 py-2 text-[0.7rem] font-medium rounded-lg transition-colors ${i === step ? "bg-navy text-white" : i < step ? "bg-gold/10 text-gold" : "bg-cream-mid text-slate-400"}`}>
                {s}
              </button>
            ))}
          </div>

          <div className="bg-white border border-cream-mid rounded-card p-6">
            {/* Step 0: Basic info */}
            {step === 0 && (
              <div className="space-y-3">
                <h3 className="font-serif text-lg text-navy mb-4">Basic information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelClass}>University name *</label><input value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="Massachusetts Institute of Technology" /></div>
                  <div><label className={labelClass}>Type</label><input value={uniType} onChange={e => setUniType(e.target.value)} className={inputClass} placeholder="Private research university" /></div>
                  <div><label className={labelClass}>Country *</label><input value={country} onChange={e => setCountry(e.target.value)} className={inputClass} placeholder="US" /></div>
                  <div><label className={labelClass}>City *</label><input value={city} onChange={e => setCity(e.target.value)} className={inputClass} placeholder="Cambridge" /></div>
                  <div><label className={labelClass}>Website</label><input value={website} onChange={e => setWebsite(e.target.value)} className={inputClass} placeholder="https://mit.edu" /></div>
                  <div><label className={labelClass}>Tagline</label><input value={tagline} onChange={e => setTagline(e.target.value)} className={inputClass} placeholder="World-leading STEM university" /></div>
                  <div><label className={labelClass}>Tuition (intl./year)</label><input type="number" value={tuition} onChange={e => setTuition(e.target.value)} className={inputClass} placeholder="57590" /></div>
                  <div><label className={labelClass}>Currency</label><input value={tuitionCurrency} onChange={e => setTuitionCurrency(e.target.value)} className={inputClass} placeholder="USD" /></div>
                  <div className="col-span-2"><label className={labelClass}>Acceptance rate (intl. %)</label><input type="number" value={acceptanceRate} onChange={e => setAcceptanceRate(e.target.value)} className={inputClass} placeholder="3.2" /></div>
                </div>
                <div><label className={labelClass}>Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} className={inputClass + " min-h-[80px]"} placeholder="Brief description of the university..." /></div>
              </div>
            )}

            {/* Step 1: Programs */}
            {step === 1 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg text-navy">Programs (English-taught)</h3>
                  <button onClick={addProgram} className="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium hover:bg-navy-mid">+ Add program</button>
                </div>
                {programs.map((p, i) => (
                  <div key={i} className="border border-cream-mid rounded-lg p-3 mb-2 grid grid-cols-3 gap-2">
                    <div className="col-span-2"><label className={labelClass}>Program name</label><input value={p.name} onChange={e => updateProgram(i, "name", e.target.value)} className={inputClass} placeholder="Computer Science and Engineering" /></div>
                    <div><label className={labelClass}>Degree type</label><input value={p.degreeType} onChange={e => updateProgram(i, "degreeType", e.target.value)} className={inputClass} placeholder="Bachelor of Science" /></div>
                    <div><label className={labelClass}>School/Faculty</label><input value={p.schoolFaculty} onChange={e => updateProgram(i, "schoolFaculty", e.target.value)} className={inputClass} placeholder="School of Engineering" /></div>
                    <div><label className={labelClass}>Duration (years)</label><input type="number" value={p.durationYears} onChange={e => updateProgram(i, "durationYears", e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Semesters</label><input type="number" value={p.durationSemesters} onChange={e => updateProgram(i, "durationSemesters", e.target.value)} className={inputClass} /></div>
                    <div className="col-span-3 flex gap-4">
                      <label className="flex items-center gap-2 text-xs text-slate-500"><input type="checkbox" checked={p.isDoubleDegree} onChange={e => updateProgram(i, "isDoubleDegree", e.target.checked)} /> Double degree</label>
                      <label className="flex items-center gap-2 text-xs text-slate-500"><input type="checkbox" checked={p.isMultiCampus} onChange={e => updateProgram(i, "isMultiCampus", e.target.checked)} /> Multi-campus</label>
                    </div>
                  </div>
                ))}
                {programs.length === 0 && <p className="text-sm text-slate-300 text-center py-8">No programs added yet</p>}
              </div>
            )}

            {/* Step 2: Requirements */}
            {step === 2 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg text-navy">Requirements</h3>
                  <button onClick={addRequirement} className="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium hover:bg-navy-mid">+ Add exam</button>
                </div>
                {requirements.map((r, i) => (
                  <div key={i} className="border border-cream-mid rounded-lg p-3 mb-2 grid grid-cols-3 gap-2">
                    <div><label className={labelClass}>Exam name</label><input value={r.examName} onChange={e => updateRequirement(i, "examName", e.target.value)} className={inputClass} placeholder="SAT" /></div>
                    <div><label className={labelClass}>Minimum score</label><input value={r.minimumScore} onChange={e => updateRequirement(i, "minimumScore", e.target.value)} className={inputClass} placeholder="1500" /></div>
                    <div><label className={labelClass}>Avg admitted</label><input value={r.avgAdmittedScore} onChange={e => updateRequirement(i, "avgAdmittedScore", e.target.value)} className={inputClass} placeholder="1540" /></div>
                  </div>
                ))}
                {requirements.length === 0 && <p className="text-sm text-slate-300 text-center py-8">No requirements added yet</p>}
              </div>
            )}

            {/* Step 3: Deadlines */}
            {step === 3 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg text-navy">Deadlines</h3>
                  <button onClick={addDeadline} className="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium hover:bg-navy-mid">+ Add deadline</button>
                </div>
                {deadlines.map((d, i) => (
                  <div key={i} className="border border-cream-mid rounded-lg p-3 mb-2 grid grid-cols-3 gap-2">
                    <div><label className={labelClass}>Type</label>
                      <select value={d.applicationType} onChange={e => updateDeadline(i, "applicationType", e.target.value)} className={inputClass}>
                        <option value="ea">Early Action</option><option value="ed">Early Decision</option>
                        <option value="rea">REA</option><option value="rd">Regular Decision</option>
                        <option value="rolling">Rolling</option><option value="other">Other</option>
                      </select>
                    </div>
                    <div><label className={labelClass}>Deadline date</label><input type="date" value={d.deadlineDate} onChange={e => updateDeadline(i, "deadlineDate", e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Decision date</label><input type="date" value={d.decisionDate} onChange={e => updateDeadline(i, "decisionDate", e.target.value)} className={inputClass} /></div>
                  </div>
                ))}
                {deadlines.length === 0 && <p className="text-sm text-slate-300 text-center py-8">No deadlines added yet</p>}
              </div>
            )}

            {/* Step 4: Application pathways */}
            {step === 4 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg text-navy">Application pathways</h3>
                  <button onClick={addPathway} className="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium hover:bg-navy-mid">+ Add pathway</button>
                </div>
                {pathways.map((p, i) => (
                  <div key={i} className="border border-cream-mid rounded-lg p-3 mb-2 grid grid-cols-2 gap-2">
                    <div><label className={labelClass}>Platform name</label><input value={p.platformName} onChange={e => updatePathway(i, "platformName", e.target.value)} className={inputClass} placeholder="Common App" /></div>
                    <div><label className={labelClass}>URL</label><input value={p.url} onChange={e => updatePathway(i, "url", e.target.value)} className={inputClass} placeholder="https://commonapp.org" /></div>
                    <div><label className={labelClass}>Fee</label><input type="number" value={p.fee} onChange={e => updatePathway(i, "fee", e.target.value)} className={inputClass} placeholder="75" /></div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1"><label className={labelClass}>Currency</label><input value={p.feeCurrency} onChange={e => updatePathway(i, "feeCurrency", e.target.value)} className={inputClass} /></div>
                      <label className="flex items-center gap-2 text-xs text-slate-500 pb-2"><input type="checkbox" checked={p.feeWaiverAvailable} onChange={e => updatePathway(i, "feeWaiverAvailable", e.target.checked)} /> Fee waiver</label>
                    </div>
                    <div className="col-span-2"><label className={labelClass}>Admin tips</label><input value={p.adminTips} onChange={e => updatePathway(i, "adminTips", e.target.value)} className={inputClass} placeholder="Both portals accepted equally" /></div>
                  </div>
                ))}
                {pathways.length === 0 && <p className="text-sm text-slate-300 text-center py-8">No pathways added yet</p>}
              </div>
            )}

            {/* Step 5: Special features */}
            {step === 5 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg text-navy">Special features</h3>
                  <button onClick={addFeature} className="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium hover:bg-navy-mid">+ Add feature</button>
                </div>
                {features.map((f, i) => (
                  <div key={i} className="border border-cream-mid rounded-lg p-3 mb-2 space-y-2">
                    <div><label className={labelClass}>Title</label><input value={f.title} onChange={e => updateFeature(i, "title", e.target.value)} className={inputClass} placeholder="Need-blind admissions for internationals" /></div>
                    <div><label className={labelClass}>Description</label><textarea value={f.description} onChange={e => updateFeature(i, "description", e.target.value)} className={inputClass + " min-h-[60px]"} placeholder="MIT does not consider financial need when admitting international students." /></div>
                  </div>
                ))}
                {features.length === 0 && <p className="text-sm text-slate-300 text-center py-8">No features added yet</p>}
              </div>
            )}

            {/* Step 6: Review */}
            {step === 6 && (
              <div>
                <h3 className="font-serif text-lg text-navy mb-4">Review</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-cream rounded-lg p-3">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">University</div>
                    <div className="font-medium text-navy">{name || "—"}</div>
                    <div className="text-slate-400">{city}, {country} · {uniType || "—"}</div>
                    <div className="text-slate-400">Tuition: {tuition ? `${tuitionCurrency} ${tuition}/yr` : "—"} · Acceptance: {acceptanceRate ? `${acceptanceRate}%` : "—"}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-cream rounded-lg p-3 text-center"><div className="font-serif text-xl text-navy">{programs.length}</div><div className="text-xs text-slate-400">Programs</div></div>
                    <div className="bg-cream rounded-lg p-3 text-center"><div className="font-serif text-xl text-navy">{requirements.length}</div><div className="text-xs text-slate-400">Requirements</div></div>
                    <div className="bg-cream rounded-lg p-3 text-center"><div className="font-serif text-xl text-navy">{deadlines.length}</div><div className="text-xs text-slate-400">Deadlines</div></div>
                    <div className="bg-cream rounded-lg p-3 text-center"><div className="font-serif text-xl text-navy">{pathways.length}</div><div className="text-xs text-slate-400">Pathways</div></div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6 pt-4 border-t border-cream-mid">
              <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="px-4 py-2 rounded-lg border border-cream-mid text-sm text-slate-500 disabled:opacity-30 hover:bg-cream transition-colors">
                ← Previous
              </button>
              {step < 6 ? (
                <button onClick={() => setStep(step + 1)} className="px-4 py-2 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy-mid transition-colors">
                  Next →
                </button>
              ) : (
                <button onClick={handleSave} disabled={saving || !name || !country || !city} className="px-6 py-2 rounded-lg bg-gold text-white text-sm font-medium hover:bg-gold/90 transition-colors disabled:opacity-50">
                  {saving ? "Saving..." : "Save university"}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
