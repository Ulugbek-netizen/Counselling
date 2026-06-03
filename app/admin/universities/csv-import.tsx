"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface ParsedRow {
  name: string; country: string; city: string; website?: string; type?: string;
  tagline?: string; tuition?: string; acceptance_rate?: string; [key: string]: string | undefined;
}

export function CsvImport() {
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [step, setStep] = useState<"upload" | "map" | "preview" | "done">("upload");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const DB_FIELDS = ["name", "country", "city", "website", "type", "tagline", "tuition_international", "acceptance_rate_international"];

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) return;

      const hdrs = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
      setHeaders(hdrs);

      // Auto-map by name similarity
      const autoMap: Record<string, string> = {};
      for (const h of hdrs) {
        const lower = h.toLowerCase().replace(/[_\s]/g, "");
        if (lower.includes("name") && !lower.includes("type")) autoMap[h] = "name";
        else if (lower.includes("country")) autoMap[h] = "country";
        else if (lower.includes("city")) autoMap[h] = "city";
        else if (lower.includes("website") || lower.includes("url")) autoMap[h] = "website";
        else if (lower.includes("type")) autoMap[h] = "type";
        else if (lower.includes("tagline")) autoMap[h] = "tagline";
        else if (lower.includes("tuition")) autoMap[h] = "tuition_international";
        else if (lower.includes("acceptance") || lower.includes("rate")) autoMap[h] = "acceptance_rate_international";
      }
      setMapping(autoMap);

      const parsed: ParsedRow[] = [];
      for (let i = 1; i < lines.length; i++) {
        const vals = lines[i].match(/(".*?"|[^,]+)/g)?.map(v => v.trim().replace(/^"|"$/g, "")) ?? [];
        const row: ParsedRow = { name: "", country: "", city: "" };
        hdrs.forEach((h, idx) => { row[h] = vals[idx] ?? ""; });
        parsed.push(row);
      }
      setRows(parsed);
      setStep("map");
    };
    reader.readAsText(file);
  }

  function getMappedValue(row: ParsedRow, dbField: string): string {
    const srcCol = Object.entries(mapping).find(([, v]) => v === dbField)?.[0];
    return srcCol ? (row[srcCol] ?? "") : "";
  }

  async function handleImport() {
    setImporting(true);
    const supabase = createClient() as any;
    let success = 0;
    let failed = 0;

    for (const row of rows) {
      const name = getMappedValue(row, "name");
      const country = getMappedValue(row, "country");
      const city = getMappedValue(row, "city");
      if (!name || !country || !city) { failed++; continue; }

      const tuitionStr = getMappedValue(row, "tuition_international");
      const rateStr = getMappedValue(row, "acceptance_rate_international");

      const { error } = await supabase.from("universities").insert({
        name, country, city,
        website: getMappedValue(row, "website") || null,
        type: getMappedValue(row, "type") || null,
        tagline: getMappedValue(row, "tagline") || null,
        tuition_international: tuitionStr ? parseFloat(tuitionStr) : null,
        acceptance_rate_international: rateStr ? parseFloat(rateStr) : null,
      });

      if (error) failed++;
      else success++;
    }

    setResult({ success, failed });
    setStep("done");
    setImporting(false);
  }

  const inputClass = "px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy bg-white outline-none focus:border-navy transition-colors";

  return (
    <div className="max-w-3xl">
      {step === "upload" && (
        <div className="bg-white border border-cream-mid rounded-card p-8 text-center">
          <div className="text-3xl mb-3">📄</div>
          <h3 className="font-serif text-lg text-navy mb-2">Import universities from CSV</h3>
          <p className="text-sm text-slate-400 mb-6">Upload a CSV file with university data. Required columns: name, country, city.</p>
          <input ref={fileRef} type="file" accept=".csv,.tsv,.txt" onChange={handleFile} className="hidden" />
          <button onClick={() => fileRef.current?.click()} className="px-6 py-3 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-mid transition-colors">
            Choose CSV file
          </button>
        </div>
      )}

      {step === "map" && (
        <div className="bg-white border border-cream-mid rounded-card p-6">
          <h3 className="font-serif text-lg text-navy mb-1">Map columns</h3>
          <p className="text-sm text-slate-400 mb-4">{rows.length} rows found. Map your CSV columns to database fields.</p>
          <div className="space-y-2 mb-4">
            {headers.map(h => (
              <div key={h} className="flex items-center gap-3">
                <span className="w-[180px] text-sm text-navy font-medium truncate">{h}</span>
                <span className="text-slate-400">→</span>
                <select value={mapping[h] ?? ""} onChange={e => setMapping({ ...mapping, [h]: e.target.value })} className={inputClass + " flex-1"}>
                  <option value="">Skip this column</option>
                  {DB_FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep("preview")} disabled={!mapping[Object.keys(mapping).find(k => mapping[k] === "name") ?? ""] } className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium disabled:opacity-50">Preview →</button>
            <button onClick={() => { setStep("upload"); setRows([]); }} className="px-4 py-2 border border-cream-mid rounded-lg text-sm text-slate-500">Cancel</button>
          </div>
        </div>
      )}

      {step === "preview" && (
        <div className="bg-white border border-cream-mid rounded-card p-6">
          <h3 className="font-serif text-lg text-navy mb-1">Preview</h3>
          <p className="text-sm text-slate-400 mb-4">{rows.length} universities ready to import.</p>
          <div className="max-h-[400px] overflow-y-auto border border-cream-mid rounded-lg mb-4">
            <table className="w-full text-sm">
              <thead className="bg-cream sticky top-0">
                <tr>{DB_FIELDS.filter(f => Object.values(mapping).includes(f)).map(f => <th key={f} className="px-3 py-2 text-left text-[0.7rem] font-semibold text-slate-400 uppercase">{f}</th>)}</tr>
              </thead>
              <tbody>
                {rows.slice(0, 20).map((row, i) => (
                  <tr key={i} className="border-t border-cream-mid">
                    {DB_FIELDS.filter(f => Object.values(mapping).includes(f)).map(f => (
                      <td key={f} className="px-3 py-2 text-navy truncate max-w-[200px]">{getMappedValue(row, f) || <span className="text-slate-300">—</span>}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > 20 && <div className="text-center text-xs text-slate-400 py-2">…and {rows.length - 20} more</div>}
          </div>
          <div className="flex gap-2">
            <button onClick={handleImport} disabled={importing} className="px-6 py-2 bg-gold text-white rounded-lg text-sm font-medium disabled:opacity-50">
              {importing ? `Importing… (${rows.length} rows)` : `Import ${rows.length} universities`}
            </button>
            <button onClick={() => setStep("map")} className="px-4 py-2 border border-cream-mid rounded-lg text-sm text-slate-500">← Back</button>
          </div>
        </div>
      )}

      {step === "done" && result && (
        <div className="bg-white border border-cream-mid rounded-card p-8 text-center">
          <div className="text-3xl mb-3">✓</div>
          <h3 className="font-serif text-xl text-navy mb-2">Import complete</h3>
          <div className="flex justify-center gap-6 mb-6">
            <div><div className="font-serif text-2xl text-status-green">{result.success}</div><div className="text-xs text-slate-400">Imported</div></div>
            {result.failed > 0 && <div><div className="font-serif text-2xl text-status-red">{result.failed}</div><div className="text-xs text-slate-400">Failed</div></div>}
          </div>
          <button onClick={() => { setStep("upload"); setRows([]); setResult(null); }} className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium">Import more</button>
        </div>
      )}
    </div>
  );
}
