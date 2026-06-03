EduPath PRD*  |  Confidential*

**EduPath**

College Counselling Platform

**Product Requirements Document (PRD)**

Version 1.0

June 2026

*Confidential*

# 1. Problem statement

High school students applying to international universities face a fragmented, overwhelming process. Applications span multiple platforms (Common App, UCAS, direct portals), deadlines vary by university and application type, essay requirements differ for each institution, and exam preparation runs in parallel. Students lose track of where they stand.

College counsellors managing 20-50+ students simultaneously rely on scattered spreadsheets, email threads, calendar reminders, and paper notes. There is no unified system to track which student needs attention, which deadline is approaching, which essay needs review, or which student has gone 30+ days without a session.

The cost of not solving this: missed deadlines, incomplete applications, overlooked scholarship opportunities, counsellor burnout, and ultimately students not reaching the universities they could have.

# 2. Product vision

EduPath is a multi-school SaaS platform that brings students, counsellors, and school administrators together in one workspace. It tracks every application, deadline, essay, exam, session, scholarship, and summer program from the first counselling meeting to acceptance day.

The platform serves as the single source of truth for the entire college application journey, replacing spreadsheets and fragmented tools with a purpose-built system that keeps everyone in sync.

# 3. Target users

## 3.1 Roles and permissions

| **Role** | **Description** | **Key permissions** |
| --- | --- | --- |
| Platform Admin | Platform owner. Manages schools, subscriptions, and all databases. | Onboard schools, manage university/scholarship/program databases, Stripe billing, view-as any school |
| School Admin | School-level administrator. Also functions as a counsellor. | Add/remove counsellors and students, school-wide reports, counsellor performance view, toggle visibility to students |
| Counsellor | Full access to all students within their school. No primary assignment. | View all students, manage sessions/essays/applications, recommend programs/scholarships, broadcast messages, generate reports |
| Student | Personal journey view only. Can request sessions with any counsellor. | Manage own applications/essays/documents, bookmark universities/programs, request sessions, view notifications and timeline |

## 3.2 Multi-school architecture

- Each school is an isolated workspace. Data never crosses school boundaries.

- All counsellors within a school see all students (open access, no primary assignment).

- Students can request sessions with any counsellor in their school.

- Platform Admin is the only role that sees across all schools.

# 4. Goals

## 4.1 User goals

- Students never miss a deadline because the platform tracks and alerts automatically.

- Counsellors see at a glance which students need urgent attention without checking each one individually.

- Schools have full documentation of every student’s journey for reporting and accountability.

- Students discover relevant programs, scholarships, and Olympiads they would have otherwise missed.

## 4.2 Business goals

- Acquire 15 paying schools within 12 months of launch.

- Achieve 84%+ profit margin on infrastructure costs.

- Build a university/scholarship/program database that becomes a competitive moat.

- Establish EduPath as the standard college counselling tool in target markets.

# 5. Non-goals (v1)

- Individual student subscriptions (Option C marketplace model) — deferred to post-launch.

- AI-powered smart university matching — start with simple filter matching; add AI later.

- Non-English-taught programs — English-taught only at launch.

- Mobile native app — responsive web only at launch.

- Built-in payment/billing system — use Stripe integration instead.

# 6. Feature specifications

## 6.1 Landing page

Two-path design targeting two audiences on one page:

### Path A — Schools and counsellors

- Features overview, benefits, demo, pricing tiers

- Call to action: “Book a demo” or “Get started for your school”

- Interactive guided demo (pre-filled read-only dashboard)

### Path B — Students

- Preview of student experience

- Call to action: “Ask your school to join EduPath” (generates pre-written email to school)

- “Already have access? Sign in”

### Sign-in form

- Student / Counsellor toggle tabs

- Email + password fields, Google sign-in option

- “Request access from your school” link → form: student name, email, school dropdown, optional note

- If school not in dropdown: “Your school isn’t on EduPath yet. Contact your school administration.”

## 6.2 Onboarding flow

### Invitation-only model

No self-registration. Every account starts with an invitation from the level above.

**Step 1:** Platform Admin creates school, sends invitation email to School Admin.

**Step 2:** School Admin clicks invite → creates password → enters school details (name, address, logo).

**Step 3:** School Admin invites counsellors by email.

**Step 4:** Counsellor or School Admin adds students by email.

**Step 5:** Student clicks invite → creates password → enters grade.

### First-time setup wizard (students)

Appears on first login. All fields optional but encouraged:

- Preferred majors (specific: Architecture, Civil Engineering, UX/UI Design, etc.)

- Preferred countries

- Exam scores (free-text exam name + score)

- Budget range (Under $15k / $15k–$30k / $30k–$50k / $50k+ / No preference)

If skipped, Universities page shows generic results with a prompt: “Complete your profile to get personalised university recommendations.”

## 6.3 Counsellor dashboard

### Sidebar navigation

Three groups:

**Main:** Dashboard, My Students, Applications, Essays, Sessions, Documents

**Explore:** Universities, Programs & Olympiads, Scholarships

**Workspace:** Chat, Counsellor Panel, Reports, Settings

### Dashboard home

**Notification banner:** Dismissable strip showing current week events — urgent deadlines, tomorrow’s sessions, birthdays, exams. Disappears after events pass.

**Stat cards (4):** Total students, Active applications (with “need attention” count), Priority students (no meeting 30+ days), Deadlines this month.

**Priority students panel:** Students with oldest/no recent meetings, with colour-coded tags (Overdue, No recent session, Essay pending, Exam upcoming).

**Urgent deadlines panel:** Upcoming deadlines sorted by urgency with colour-coded bars (red ≤ 7 days, amber ≤ 30 days, green > 30 days).

**Calendar:** Mini calendar with month navigation. Events dot-coded: red = deadlines, purple = exams, green = birthdays, gold = sessions. Event list below.

## 6.4 Student dashboard

### Sidebar navigation

Dashboard, My Applications, Essays, Universities, Programs & Olympiads, Scholarships, My Documents, Sessions, Chat, Profile, Settings

### Dashboard home

**Notification panel (3 columns):** Application deadlines, Scholarships & programs, Exams & tests. Each sorted by urgency, capped at 5 items with “View all” link. Filter by: This week / Next 30 days / All upcoming.

**Stat cards (5):** Universities on my list, Applications submitted, Essays in progress, Days to next deadline, Next meeting with counsellor.

**University list:** Personal list with application status per university.

**Timeline:** Horizontal scrollable Gantt-style view. One row per university showing work period bar + deadline dot (red) + decision date dot (green). Vertical red “today” line. Exams row at bottom pinning SAT/IELTS/etc. Scrolls to cover full academic year.

**Session request:** All school counsellors visible. Request includes: subject/note, preferred date and time. Counsellor approves or reschedules. Approved sessions appear in notification bar and Sessions page.

## 6.5 Applications

### Two views with toggle

**By application (flat table):** One row per application (not per student). Columns: Student, University, Type (EA/RD), Deadline, Days left (colour-coded badge), Status, Essay status, Progress bar. Filters: search, student, status, type, deadline window.

**By university (grouped accordion):** Each university as a card showing pill summary (X applied, X planning, X total). Click to expand and see individual student rows inside. No university rankings shown.

### Application status lifecycle

- Considering — bookmarked, no action yet (free, no approval needed)

- Active application — counsellor approved, deadlines activate, essay tracking starts

- Submitted — application sent

- Accepted — got in, scholarship field unlocks

- Rejected — not accepted

- Waitlisted — waiting for decision

- Enrolled — final choice, this is where the student is going

## 6.6 Essays

- Student writes the essay and submits it.

- Automatically appears in counsellor’s Essays tab.

- Counsellor adds inline comments.

- Student sees comments on their side for each essay individually.

- Revision history tracked.

- Each student only sees their own essays and comments.

## 6.7 Sessions and meetings

### Student-initiated

- Student sees all available counsellors in their school.

- Request form: subject/note, preferred date and time, which counsellor.

- Counsellor receives request → approves or reschedules.

- Once approved → appears in student’s notification bar + Sessions page.

### Counsellor-initiated

- Any counsellor can schedule a meeting with any student — no restrictions.

- Student receives notification of scheduled session.

### School Admin visibility toggle

- School Admin has a toggle: “Show me as available counsellor to students.”

- On by default. Can be turned off for purely administrative school admins.

## 6.8 Documents

- Two access points: dedicated Documents page (all documents across students) + Documents tab inside each student’s profile.

- Predefined categories: Transcripts, Recommendation Letters, Personal Statement, CV/Resume, Test Score Reports, Financial Documents, Other.

- When “Other” is selected: a text field appears for the document name. Saves as “Other: [label]”.

- Students upload their own documents. Counsellors can view all.

## 6.9 Universities

### Database management

- Only Platform Admin can add/edit/remove universities.

- English-taught programs only at launch.

- Step-by-step form: Basic info → Programs → Requirements → Deadlines → Application pathways → Special features.

- CSV bulk import for initial database load.

### Browse view (Layer 1 — cards)

Each university card shows:

- Flag, name, location (city, country)

- One-line tagline describing university type

- Specific major names (closest match to student first + “+X more”)

- Tuition (international), acceptance rate (international students)

- Application types available (EA/ED/RD)

- Match score (percentage + bar) based on student profile

- Reach / Target / Safety label

- Next deadline with days left and urgency colour

- Bookmark button

### Filters

- Search, country, major, tuition range, acceptance rate range, sort order

- Filters auto-populate from student’s profile preferences on every visit

- Student can change filters freely; reset to profile defaults on revisit

### University profile (Layer 2)

**Overview:** Name, location, tagline, description, tuition, acceptance rate, key stats.

**Programs:** Full list of English-taught majors with specific names, school/faculty within university, duration in years, total semesters, match label. Multi-campus and double degree details here.

**Requirements:** Exam minimums with student’s own scores compared (green check / amber warning). Documents needed. Language requirements.

**Deadlines:** All application types with dates and days remaining.

**Application pathways:** Platform name (Common App, UCAS, direct), link, fee with currency, fee waiver availability, which programs use which pathway. Admin tips field.

**Special features:** Multi-campus, exchange partnerships, co-op programs, university-specific scholarships, unique offerings.

### Recommendations

- Auto-generated top 10 based on student preferences, countries, and scores (simple filter matching at launch).

- Visible to both student and counsellor.

- Counsellor can recommend a university directly to a student → student gets notification.

### Two-stage bookmarking

- Stage 1 — Considering: free bookmarking by student. No approval needed. Personal wishlist. Counsellor can see it.

- Stage 2 — Active application: requires counsellor approval. Triggers deadlines, timeline, essay tracking.

## 6.10 Programs and Olympiads

- Only Platform Admin adds programs to the database (name, type, host institution, location, price, dates, what’s included, deadline).

- Students browse and bookmark programs.

- Bookmarked program deadline feeds into notification panel + timeline.

- Counsellor sees bookmarked programs under each student’s profile.

- Counsellor can add notes (e.g. “good choice, apply early”) and mark as recommended or not recommended.

- Counsellor can recommend a program directly to a student → student gets notification.

- Only student can bookmark or remove from their own list.

## 6.11 Scholarships

- Only Platform Admin adds scholarships (name, amount, eligibility, deadline, required documents, link).

- Counsellors browse and bookmark scholarships to a “Tracked scholarships” list.

- Counsellors can assign/recommend scholarships to specific students.

- Students see recommendation notification → click approve to add to their list.

- Students can also browse and bookmark independently.

- Bookmarked scholarship deadline feeds into notification panel + timeline.

### Scholarship tracking post-acceptance

When a student’s application status changes to “Accepted”:

- Scholarship awarded? Yes / No

- If yes: scholarship name, amount per year, type (full tuition / partial / fixed amount / living stipend)

- Duration covered (defaults to full program length, adjustable)

- Renewable? Yes / No / Conditional

### Auto-calculated figures

- Per year amount

- Total awarded (amount × duration)

- Scholarship type label (e.g. “Partial — covers 35% of total tuition”)

- Full tuition scholarships: platform pulls tuition from university profile and calculates automatically

- Living stipends: entered separately, added on top of tuition scholarship

### Report views

- Per student: “Aisha — MIT — $80,000 total (4 years)”

- Per graduating class: “Class of 2026 — 15 students — $1.2M total”

- School all-time: “Since joining — $3.5M across 85 students”

## 6.12 Chat

### One-on-one

- Direct messaging between student and any counsellor.

### Broadcast

- Counsellor selects audience before sending:

- All students in the school

- By grade (Grade 10, 11, 12)

- By smart auto-generated groups (by university, exam, application type, status)

- Hand-picked individual students

- Combined filters (e.g. “Grade 11 + applying to USA”)

- Groups are auto-generated from existing data — no manual creation.

- Broadcast clearly marked on student’s side.

- Student replies go to the original sender as one-on-one chat.

### Shared log

- All counsellors in the school see all broadcasts as a shared log.

- Only the original sender can edit or delete their broadcast.

## 6.13 Profile

### Student profile contents

- Personal info: name, birthday, grade, school, profile photo (editable by counsellor only, not student)

- Exam scores: free-text exam name, date, score (optional until taken), status (Planned / Taken). Same exam can be added multiple times for retakes. Exam dates auto-feed into notifications and timeline.

- Extracurriculars and awards

- Profile completion bar

### Student settings

- Language preference, notification preferences, change password only.

- Name, birthday, photo — counsellor-managed.

### Counsellor settings

- Change password, profile photo, language preference, notification preferences, professional info (title, department), manage availability for sessions.

## 6.14 Reports

Dedicated Reports section in sidebar for both counsellors and school admins.

### Customisable report builder

Counsellor/school admin selects what to include via checklist:

- Application outcomes (accepted, rejected, waitlisted)

- Exam score distributions (IELTS by band, SAT by range, any exam in system)

- Average scores across school

- Session activity

- Scholarship amounts awarded (per student, per class, all-time)

- Most popular universities

- Essay completion rates

- Deadline compliance

- Counsellor activity (school admin only)

Select time period or graduating year → generate → view on screen or export as PDF / spreadsheet. Save report templates for reuse.

### Exam statistics

For each exam type in the system (IELTS, SAT, TOEFL, Cambridge, etc.):

- Total students who took the exam

- Score distribution by bands/ranges

- Average score across the school

- Filterable by graduating year for year-over-year comparison

- Counsellor/school admin can opt in or out of any exam type in reports

## 6.15 Platform Admin dashboard

### Sidebar navigation

Dashboard, Schools, Universities, Scholarships, Programs & Olympiads, Subscriptions, Pending Requests, Settings

### Dashboard home

- Stat cards: Total schools active, Total students, Monthly revenue, Pending requests

- Recent activity log

- Subscription alerts (expiring, failed payments, schools near tier limit)

- Schools overview table

### School management

- List all schools with name, country, tier, student count vs limit, subscription status

- Click into school → details, admin contact, plan, usage stats

- Add new school / send invitation

- “View as” feature — see exactly what school’s counsellors and students see

### Database management

Step-by-step form + CSV bulk import for: universities, scholarships, programs & Olympiads.

University form steps: Basic info → Programs (specific major names, duration, semesters) → Requirements → Deadlines → Application pathways (platform, link, fee, fee waiver) → Special features.

### Pending requests

- School demo requests from landing page

- Student requests where school isn’t registered (sales leads)

- Unified list with school name, contact, date, source

# 7. Subscription and pricing

## 7.1 Tiers (capacity only, all features included)

| **Tier** | **Students** | **Counsellors** | **Monthly** | **Annual (20% off)** |
| --- | --- | --- | --- | --- |
| Starter | Up to 50 | Up to 3 | $25/mo | $240/yr |
| Growth | Up to 150 | Up to 8 | $55/mo | $528/yr |
| Professional | Up to 350 | Up to 15 | $99/mo | $950/yr |
| Enterprise | Unlimited | Unlimited | Custom | Contact us |

## 7.2 Stripe integration

- Stripe handles all payment processing, card storage, recurring billing, receipts.

- Platform Admin dashboard shows: revenue summary, active subscriptions, overdue payments.

- Detailed financial management done in Stripe dashboard directly.

## 7.3 Limit enforcement

- Soft block: when school hits student/counsellor limit, admin sees “You’ve reached your plan limit. Contact us to upgrade.”

- Cannot add more students/counsellors, but existing users unaffected.

- Platform Admin gets notification to reach out proactively.

## 7.4 Subscription lifecycle

- 7-day grace period on expired subscriptions.

- During grace period: school works normally, admin sees warning banner.

- After 7 days: school goes read-only. Everyone can log in and view data but cannot add or edit.

- Nothing gets deleted. Platform Admin notified for follow-up.

- Data export: school admin can export all student data as CSV/spreadsheet at any time.

# 8. Infrastructure and costs

## 8.1 Tech stack

- Frontend: Next.js (React) deployed on Vercel

- Backend/database: Supabase (Postgres, auth, realtime, file storage, edge functions)

- Payments: Stripe

- Email: Resend (invitations, notifications, password resets)

- Monitoring: Sentry (error tracking), Vercel Analytics

## 8.2 Monthly costs (at launch, 1–10 schools)

| **Service** | **Monthly cost** | **Notes** |
| --- | --- | --- |
| Vercel Pro | $20 | Frontend hosting, CDN |
| Supabase Pro | $25 | Database, auth, storage |
| Stripe fees | ~$5–$15 | 2.9% + $0.30 per txn |
| Email, domain, misc | $0–$10 | Free tiers available |
| Total | $50–$85/mo | $600–$1,020/yr |

Break-even: 3 Starter schools. At 15 schools: ~84% profit margin.

Development and testing on free tiers: Vercel Hobby ($0), Supabase Free ($0), Stripe test mode ($0). Total cost during development: $0.

# 9. Development phases

## Phase 1 — Foundation

- Project setup (Next.js + Supabase + Vercel)

- Database schema design (schools, users, roles, universities)

- Authentication system (sign-in, role-based routing, invitations)

- Landing page (connected to real auth, two-path design)

## Phase 2 — Core dashboards

- Counsellor dashboard (stats, calendar, priority students, notifications)

- Student dashboard (notifications, stats, university list, timeline)

- University database and browsing (cards, profile, filters, recommendations)

## Phase 3 — Full features

- Applications (two-view table + accordion)

- Essays (write, comment, revision tracking)

- Sessions (request, approval, scheduling)

- Documents (upload, categories, management)

- Chat and broadcast

- Programs, scholarships, Olympiads

## Phase 4 — Business layer

- Stripe integration and subscription management

- Platform Admin dashboard

- Tier limits and soft blocks

- School admin panel and reports

## Phase 5 — Polish and launch

- Testing with pilot school

- Bug fixes and performance optimisation

- Demo page (interactive guided tour)

- Launch

# 10. Open questions

- [Business] Final pricing validation — test $25/mo Starter with target market schools.

- [Business] Enterprise tier pricing — what amount for unlimited?

- [Design] Demo page format — interactive read-only dashboard vs video walkthrough vs both?

- [Legal] Data protection compliance — GDPR, local education data regulations per target country.

- [Legal] Terms of service and privacy policy.

- [Product] Option C (individual students + independent counsellors marketplace) — timeline for Phase 2?

- [Product] Mobile native app — timeline and priority?

- [Product] AI-powered university matching — when to upgrade from simple filter matching?

# 11. Success metrics

## Leading indicators (weeks)

- School sign-up rate: 2+ schools per month within 3 months of launch

- Active usage: 70%+ of students log in weekly

- Session requests: students actively requesting counsellor sessions through platform

- Document upload rate: 80%+ of students upload required documents

## Lagging indicators (months)

- School retention: 90%+ annual renewal rate

- Student outcomes: schools report improved application completion rates

- Scholarship tracking: total scholarship value increases year over year

- Platform growth: 15 schools within 12 months

- Revenue target: $750+/month recurring revenue within 12 months

*End of document*

Page