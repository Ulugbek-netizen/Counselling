## Parent PRD
`issues/prd.md`

## What to build
Interactive guided demo page with pre-filled sample data. Read-only — visitors can click through a fake counsellor dashboard and student dashboard with sample students, deadlines, essays, and timeline already populated. No sign-up required. Accessible from landing page "See it in action" button.

See PRD section 6.1 (landing page — demo).

## Acceptance criteria
- [ ] Demo accessible without sign-in
- [ ] Pre-filled counsellor dashboard with sample students
- [ ] Pre-filled student dashboard with sample universities and timeline
- [ ] All interactions work (click tabs, expand accordions, navigate pages)
- [ ] Read-only — no real data created
- [ ] Clear "This is a demo" indicator
- [ ] CTA to "Book a demo" or "Get started" from within the demo
- [ ] Mobile responsive

## Blocked by
- `issues/003-counsellor-dashboard-stats-notifications.md`
- `issues/008-student-dashboard-stats-notifications.md`

## User stories addressed
- As a school admin evaluating EduPath, I want to see how it works before committing

---
## Completion notes
**Status: COMPLETE**
- Standalone demo page with sample data (no auth required)
- Full counsellor dashboard replica: sidebar, topbar, banner, stats, students, deadlines, calendar
- "This is a demo" gold banner with CTA
- 4 sample students, 3 deadlines, 4 weekly events
- Accessible from landing page "See it in action" button
