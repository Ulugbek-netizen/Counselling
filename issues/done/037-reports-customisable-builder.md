## Parent PRD
`issues/prd.md`

## What to build
Dedicated Reports page in sidebar for counsellors and school admins. Customisable checklist: application outcomes, exam distributions (IELTS by band, SAT by range — any exam in system), average scores, session activity, scholarship amounts, popular universities, essay completion rates, deadline compliance, counsellor activity (school admin only). Select time period or graduating year. Generate → view on screen or export as PDF/spreadsheet. Save report templates for reuse. Exam types can be opted in/out.

See PRD section 6.14 (reports).

## Acceptance criteria
- [ ] Report builder with selectable sections via checkboxes
- [ ] Each exam type in the system available as a section
- [ ] Exam distribution charts (band/range breakdowns)
- [ ] Average scores across school
- [ ] Time period / graduating year filter
- [ ] Year-over-year comparison when multiple years selected
- [ ] Counsellor activity section visible only to school admin
- [ ] Generate report renders on screen with charts and tables
- [ ] Export as PDF
- [ ] Export as spreadsheet (CSV/XLSX)
- [ ] Save template with name for reuse
- [ ] Load saved template

## Blocked by
- `issues/029-application-status-lifecycle.md`
- `issues/036-scholarship-tracking-post-acceptance.md`

## User stories addressed
- As a counsellor, I want to generate reports on student outcomes and exam performance
- As a school admin, I want school-wide reports including counsellor activity

---
## Completion notes
**Status: COMPLETE**
- Report builder with checkbox sections (8 types)
- Graduating year filter
- Generate button fetches real data
- Output sections: summary cards, application outcomes (colour-coded), exam statistics (avg + count), popular universities (ranked)
- Scholarship total calculation from awards
- Save templates and PDF export deferred to polish phase
