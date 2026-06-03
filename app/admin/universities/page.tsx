"use client";

import { useState } from "react";
import { UniversityForm } from "./university-form";
import { CsvImport } from "./csv-import";

export default function AdminUniversitiesPage() {
  const [mode, setMode] = useState<"form" | "csv">("form");

  return (
    <div className="min-h-screen bg-cream">
      <div className="border-b border-cream-mid bg-white px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl text-navy">Manage universities</h1>
          <p className="text-xs text-slate-400 mt-0.5">Add universities individually or import from CSV</p>
        </div>
        <div className="flex gap-1 bg-cream-mid rounded-lg p-0.5">
          <button onClick={() => setMode("form")} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === "form" ? "bg-white text-navy shadow-sm" : "text-slate-400"}`}>
            Add one
          </button>
          <button onClick={() => setMode("csv")} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === "csv" ? "bg-white text-navy shadow-sm" : "text-slate-400"}`}>
            CSV import
          </button>
        </div>
      </div>
      <div className="p-8">
        {mode === "form" ? <UniversityForm /> : <CsvImport />}
      </div>
    </div>
  );
}
