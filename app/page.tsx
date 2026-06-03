import Link from "next/link";
import { PricingSection } from "@/components/landing/pricing-section";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-cream-mid">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl text-navy">Edu<span className="text-gold">Path</span></Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-500">
            <a href="#features" className="hover:text-navy transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-navy transition-colors">How it works</a>
            <a href="#who" className="hover:text-navy transition-colors">Who it&apos;s for</a>
            <a href="#faq" className="hover:text-navy transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm text-slate-500 hover:text-navy transition-colors">Sign in</Link>
            <a href="#get-started" className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-mid transition-colors">Get started</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl md:text-5xl text-navy leading-tight mb-4">
            Every student&apos;s college journey,<br /><em className="text-gold">guided from one place</em>
          </h1>
          <p className="text-lg text-slate-500 mb-8 max-w-xl leading-relaxed">
            One workspace for students and counsellors — tracking applications, deadlines, essays, programs, scholarships, and every milestone from first meeting to acceptance day.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#get-started" className="px-6 py-3 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-mid transition-colors">Get started for your school →</a>
            <a href="#demo" className="px-6 py-3 border border-cream-mid text-slate-500 rounded-lg text-sm font-medium hover:bg-white transition-colors">See it in action</a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-navy">
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-4 gap-8 text-center">
          {[
            { val: "1,200+", label: "Universities tracked" },
            { val: "60+", label: "Programs & Olympiads" },
            { val: "100%", label: "Features in every plan" },
            { val: "4", label: "Roles, one platform" },
          ].map(s => (
            <div key={s.label}>
              <div className="font-serif text-2xl text-white">{s.val}</div>
              <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl text-navy mb-3">Everything counsellors and students need</h2>
          <p className="text-slate-500 max-w-lg mx-auto">Replace spreadsheets, scattered emails, and forgotten deadlines with one purpose-built platform.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "🎓", title: "University browser", desc: "1,200+ universities with programs, requirements, deadlines, and application pathways. Smart matching based on student preferences." },
            { icon: "📋", title: "Application tracker", desc: "Visual timeline from first bookmark to final decision. Deadlines, essays, and documents in one view." },
            { icon: "✍️", title: "Essay management", desc: "Students write, counsellors review. Inline comments, revision history, and status tracking." },
            { icon: "📅", title: "Session scheduling", desc: "Students request sessions with any counsellor. Approve, reschedule, and track meeting history." },
            { icon: "🏅", title: "Scholarships & programs", desc: "Discover and track scholarships, summer programs, and Olympiads. Post-acceptance award tracking." },
            { icon: "💬", title: "Chat & broadcast", desc: "One-on-one messaging and targeted broadcasts by grade, university, or custom groups." },
            { icon: "📊", title: "Reports", desc: "Customisable reports: outcomes, exam distributions, scholarship totals. Export PDF or spreadsheet." },
            { icon: "📄", title: "Documents", desc: "Organised document uploads: transcripts, recommendations, test scores. One place for everything." },
            { icon: "👥", title: "Multi-school platform", desc: "Each school is an isolated workspace. Platform admin manages everything. Schools manage their own students." },
          ].map(f => (
            <div key={f.title} className="bg-white border border-cream-mid rounded-card p-5 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-3">{f.icon}</div>
              <div className="font-serif text-base text-navy mb-1">{f.title}</div>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-navy py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-3xl text-white text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "School joins", desc: "We set up your school workspace and invite the admin." },
              { step: "2", title: "Add counsellors", desc: "School admin invites counsellors by email." },
              { step: "3", title: "Add students", desc: "Counsellors add students. Students complete setup wizard." },
              { step: "4", title: "Start counselling", desc: "Browse universities, track applications, write essays, book sessions — all in one place." },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-navy font-serif text-lg mx-auto mb-3">{s.step}</div>
                <div className="font-serif text-base text-white mb-1">{s.title}</div>
                <p className="text-sm text-white/40">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section id="who" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-serif text-3xl text-navy text-center mb-12">Who it&apos;s for</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-cream-mid rounded-card p-6">
            <h3 className="font-serif text-xl text-navy mb-2">Schools & counsellors</h3>
            <p className="text-sm text-slate-500 mb-4">Stop managing applications in spreadsheets. See all students, deadlines, and progress in one dashboard. Generate reports for leadership.</p>
            <a href="#get-started" className="inline-flex px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-mid transition-colors">Get started for your school →</a>
          </div>
          <div className="bg-white border border-cream-mid rounded-card p-6">
            <h3 className="font-serif text-xl text-navy mb-2">Students</h3>
            <p className="text-sm text-slate-500 mb-4">Never miss a deadline. Track every application, essay, and exam. Discover universities and scholarships matched to your profile.</p>
            <div className="flex flex-col gap-2">
              <Link href="/sign-in" className="inline-flex px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-mid transition-colors w-fit">Already have access? Sign in</Link>
              <Link href="/request-access" className="inline-flex px-4 py-2 border border-cream-mid rounded-lg text-sm text-slate-500 hover:bg-cream transition-colors w-fit">Request access from your school</Link>
            </div>
          </div>
        </div>
      </section>

      <PricingSection />

      {/* CTA */}
      <section id="get-started" className="bg-navy py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl text-white mb-3">Ready to streamline college counselling?</h2>
          <p className="text-white/40 mb-8">All features included in every plan. Start with up to 50 students.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="mailto:hello@edupath.com?subject=EduPath%20Demo%20Request" className="px-6 py-3 bg-gold text-white rounded-lg text-sm font-medium hover:bg-gold/90 transition-colors">Book a demo</a>
            <Link href="/sign-in" className="px-6 py-3 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">Sign in</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="font-serif text-3xl text-navy text-center mb-8">Frequently asked questions</h2>
        {[
          { q: "How much does EduPath cost?", a: "Plans start at $25/month for up to 50 students. All features are included in every plan — pricing is based on capacity only." },
          { q: "Can students sign up on their own?", a: "No. EduPath is invitation-only. Students are added by their school's counsellors or admin. Students without access can request it from their school." },
          { q: "Do all counsellors see all students?", a: "Yes. Within a school, all counsellors have access to all students. There's no primary counsellor assignment — any counsellor can work with any student." },
          { q: "What happens if our school's subscription expires?", a: "You get a 7-day grace period. After that, your school goes read-only — everyone can still view data but can't add or edit. Data is never deleted." },
          { q: "Can we export our data?", a: "Yes. School admins can export all student data as CSV/spreadsheet at any time." },
        ].map(item => (
          <details key={item.q} className="mb-3 bg-white border border-cream-mid rounded-lg overflow-hidden group">
            <summary className="cursor-pointer px-5 py-3.5 text-sm font-medium text-navy flex items-center justify-between hover:bg-cream/50 transition-colors">
              {item.q}
              <span className="text-slate-400 group-open:rotate-45 transition-transform">+</span>
            </summary>
            <div className="px-5 py-3 text-sm text-slate-500 border-t border-cream-mid">{item.a}</div>
          </details>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-cream-mid py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="font-serif text-base text-navy">Edu<span className="text-gold">Path</span></div>
          <div className="text-xs text-slate-400">© 2026 EduPath. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
