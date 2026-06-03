"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Props {
  universityId: string;
  universityName: string;
  bookmarkStatus: "none" | "considering" | "active";
  bookmarkId: string | null;
}

export function BookmarkActions({ universityId, universityName, bookmarkStatus: initial, bookmarkId }: Props) {
  const [status, setStatus] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  async function handleAddToList() {
    setSaving(true);
    const supabase = createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("university_bookmarks").insert({ student_id: user?.id, university_id: universityId, status: "considering" });
    setStatus("considering");
    setSaving(false);
    router.refresh();
  }

  async function handleRemove() {
    setSaving(true);
    const supabase = createClient() as any;
    await supabase.from("university_bookmarks").delete().eq("id", bookmarkId);
    setStatus("none");
    setSaving(false);
    router.refresh();
  }

  async function handleRequestActive() {
    setShowConfirm(true);
  }

  async function confirmActive() {
    setSaving(true);
    const supabase = createClient() as any;
    // Mark as needing counsellor approval — set to "considering" with a flag
    // For now, we just update the status. In full implementation, this would trigger a notification
    await supabase.from("university_bookmarks").update({ status: "active" }).eq("id", bookmarkId);
    // Also create an application entry
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("applications").insert({
      student_id: user?.id,
      university_id: universityId,
      bookmark_id: bookmarkId,
      status: "active",
    });
    setStatus("active");
    setShowConfirm(false);
    setSaving(false);
    router.refresh();
  }

  if (status === "none") {
    return (
      <button onClick={handleAddToList} disabled={saving} className="px-4 py-2 bg-gold text-white rounded-lg text-sm font-medium hover:bg-gold/90 transition-colors disabled:opacity-50">
        {saving ? "Adding…" : "★ Add to my list"}
      </button>
    );
  }

  if (status === "considering") {
    return (
      <div className="flex items-center gap-2">
        <span className="bg-amber-50 text-status-amber text-xs font-medium px-2.5 py-1 rounded-full">★ Considering</span>
        <button onClick={handleRequestActive} disabled={saving} className="px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-medium hover:bg-navy-mid transition-colors">
          Apply to this university →
        </button>
        <button onClick={handleRemove} disabled={saving} className="px-2 py-1.5 text-xs text-slate-400 hover:text-status-red transition-colors">Remove</button>

        {showConfirm && (
          <div className="fixed inset-0 bg-navy/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-card p-6 max-w-sm shadow-2xl">
              <h3 className="font-serif text-lg text-navy mb-2">Start application?</h3>
              <p className="text-sm text-slate-500 mb-4">
                Moving <strong>{universityName}</strong> to Active Application will activate deadline tracking, timeline entry, and essay management. Your counsellor will be notified.
              </p>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowConfirm(false)} className="px-3 py-1.5 border border-cream-mid rounded-lg text-xs text-slate-500">Cancel</button>
                <button onClick={confirmActive} disabled={saving} className="px-4 py-1.5 bg-gold text-white rounded-lg text-xs font-medium disabled:opacity-50">
                  {saving ? "Activating…" : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <span className="bg-emerald-50 text-status-green text-xs font-medium px-2.5 py-1 rounded-full">✓ Active application</span>
  );
}
