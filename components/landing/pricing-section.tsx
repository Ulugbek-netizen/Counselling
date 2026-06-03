"use client";

import { useState } from "react";

const TIERS = [
  { name: "Starter", monthly: 25, annual: 240, students: 50, counsellors: 3, highlight: false },
  { name: "Growth", monthly: 55, annual: 528, students: 150, counsellors: 8, highlight: true },
  { name: "Professional", monthly: 99, annual: 950, students: 350, counsellors: 15, highlight: false },
  { name: "Enterprise", monthly: null, annual: null, students: null, counsellors: null, highlight: false },
];

const FEATURES = [
  "University browser + matching", "Application tracking + timeline", "Essay management + comments",
  "Session scheduling", "Scholarships + programs", "Chat + broadcast", "Reports builder", "CSV export", "Email notifications",
];

export function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");

  return (
    <section id="pricing" className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h2 className="font-serif text-3xl text-navy mb-3">Simple, capacity-based pricing</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-6">All features included in every plan. Pay only for the capacity you need.</p>
        <div className="inline-flex gap-1 bg-cream-mid rounded-lg p-0.5">
          <button onClick={() => setBilling("monthly")} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${billing === "monthly" ? "bg-white text-navy shadow-sm" : "text-slate-400"}`}>Monthly</button>
          <button onClick={() => setBilling("annual")} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${billing === "annual" ? "bg-white text-navy shadow-sm" : "text-slate-400"}`}>Annual <span className="text-status-green text-xs ml-1">save 20%</span></button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {TIERS.map(tier => (
          <div key={tier.name} className={`bg-white rounded-card p-6 flex flex-col ${tier.highlight ? "border-2 border-gold shadow-lg relative" : "border border-cream-mid"}`}>
            {tier.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white text-[0.65rem] font-semibold px-3 py-0.5 rounded-full">Most popular</div>}
            <div className="font-serif text-lg text-navy mb-1">{tier.name}</div>
            {tier.monthly !== null ? (
              <div className="mb-4">
                <span className="font-serif text-3xl text-navy">${billing === "annual" ? Math.round(tier.annual! / 12) : tier.monthly}</span>
                <span className="text-sm text-slate-400">/mo</span>
                {billing === "annual" && <div className="text-xs text-slate-400 mt-0.5">Billed ${tier.annual}/year</div>}
              </div>
            ) : (
              <div className="mb-4"><span className="font-serif text-2xl text-navy">Custom</span><div className="text-xs text-slate-400 mt-0.5">Contact us</div></div>
            )}
            <div className="space-y-2 mb-6 flex-1">
              <div className="flex items-center gap-2 text-sm text-navy"><span className="text-status-green">✓</span>{tier.students !== null ? `Up to ${tier.students} students` : "Unlimited students"}</div>
              <div className="flex items-center gap-2 text-sm text-navy"><span className="text-status-green">✓</span>{tier.counsellors !== null ? `Up to ${tier.counsellors} counsellors` : "Unlimited counsellors"}</div>
              <div className="flex items-center gap-2 text-sm text-navy"><span className="text-status-green">✓</span>All features included</div>
            </div>
            <a href={tier.monthly !== null ? "#get-started" : "mailto:hello@edupath.com?subject=Enterprise"} className={`w-full py-2.5 rounded-lg text-sm font-medium text-center transition-colors ${tier.highlight ? "bg-gold text-white hover:bg-gold/90" : "bg-navy text-white hover:bg-navy-mid"}`}>
              {tier.monthly !== null ? "Get started" : "Contact us"}
            </a>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-white border border-cream-mid rounded-card p-6">
        <h3 className="font-serif text-base text-navy mb-4 text-center">Every plan includes</h3>
        <div className="grid md:grid-cols-3 gap-3">
          {FEATURES.map(f => <div key={f} className="flex items-center gap-2 text-sm text-slate-500"><span className="text-status-green text-xs">✓</span>{f}</div>)}
        </div>
      </div>
    </section>
  );
}
