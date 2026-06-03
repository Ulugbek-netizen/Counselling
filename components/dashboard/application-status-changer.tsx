"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  applicationId: string;
  currentStatus: string;
  onStatusChange?: (newStatus: string) => void;
  canEdit: boolean;
}

const ALL_STATUSES = ["considering", "active", "submitted", "accepted", "rejected", "waitlisted", "enrolled"];
const STATUS_LABELS: Record<string, string> = {
  considering: "Considering", active: "Active", submitted: "Submitted",
  accepted: "Accepted", rejected: "Rejected", waitlisted: "Waitlisted", enrolled: "Enrolled",
};
const STATUS_STYLES: Record<string, string> = {
  considering: "bg-gray-100 text-slate-500", active: "bg-amber-50 text-status-amber",
  submitted: "bg-blue-50 text-status-blue", accepted: "bg-emerald-50 text-status-green",
  rejected: "bg-red-50 text-status-red", waitlisted: "bg-purple-50 text-status-purple",
  enrolled: "bg-gold/10 text-gold",
};

export function ApplicationStatusChanger({ applicationId, currentStatus, onStatusChange, canEdit }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  async function changeStatus(newStatus: string) {
    if (newStatus === status) { setShowDropdown(false); return; }

    // Enrolled validation: only one enrolled per student would need a server check
    setSaving(true);
    const supabase = createClient() as any;
    const updates: Record<string, unknown> = { status: newStatus };
    if (newStatus === "submitted") updates.submitted_at = new Date().toISOString();
    if (["accepted", "rejected", "waitlisted"].includes(newStatus)) updates.decision_received_at = new Date().toISOString();

    await supabase.from("applications").update(updates).eq("id", applicationId);
    setStatus(newStatus);
    setShowDropdown(false);
    setSaving(false);
    onStatusChange?.(newStatus);
  }

  if (!canEdit) {
    return <span className={`text-[0.65rem] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[status] ?? ""}`}>{STATUS_LABELS[status] ?? status}</span>;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={saving}
        className={`text-[0.65rem] font-medium px-2 py-0.5 rounded-full cursor-pointer hover:ring-2 hover:ring-cream-dark transition-all ${STATUS_STYLES[status] ?? ""}`}
      >
        {saving ? "…" : STATUS_LABELS[status] ?? status} ▾
      </button>
      {showDropdown && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-cream-mid rounded-lg shadow-lg z-20 py-1 min-w-[140px]">
          {ALL_STATUSES.map(s => (
            <button
              key={s}
              onClick={() => changeStatus(s)}
              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-cream transition-colors flex items-center gap-2 ${s === status ? "font-semibold" : ""}`}
            >
              <span className={`w-2 h-2 rounded-full ${STATUS_STYLES[s]?.split(" ")[0] ?? "bg-gray-100"}`} />
              {STATUS_LABELS[s]}
              {s === status && <span className="ml-auto text-gold">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
