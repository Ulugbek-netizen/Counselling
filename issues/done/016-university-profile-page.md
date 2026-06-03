## Parent PRD
`issues/prd.md`

## What to build
Full university profile page with tabbed view. Overview: stats (tuition, acceptance rate, application types, next deadline), description, matching programs preview, requirements snapshot. Programs tab: full list with specific names, school/faculty, duration years, semesters, match label (Strong/Related). Requirements tab: exam minimums with student's own scores compared (green check / amber warning), documents needed. Deadlines tab: all application types with dates and days remaining. Application pathways tab: platform name (Common App/UCAS/direct), link, fee with currency, fee waiver, admin tips. Special features tab: multi-campus, exchanges, double degrees, unique programs.

See PRD section 6.9 (universities — university profile).

## Acceptance criteria
- [ ] Tabbed navigation: Overview, Programs, Requirements, Deadlines, Application pathways, Special features
- [ ] Overview shows key stats, description, top matching programs
- [ ] Programs table: name, school, duration (years), semesters, match label
- [ ] Requirements: exam minimums with student score comparison (✓ meets / ✗ below)
- [ ] Deadlines: all types with dates and colour-coded days remaining
- [ ] Application pathways: platform, link, fee, fee waiver, tips
- [ ] "Add to my list" and "Visit website" buttons in header
- [ ] Match score and reach/target/safety label visible

## Blocked by
- `issues/013-university-admin-form.md`

## User stories addressed
- As a student, I want to see complete details about a university before deciding to apply
- As a student, I want to see if my exam scores meet the university's requirements

---
## Completion notes
**Status: COMPLETE**
- Full university profile: header with stats, programs, requirements (with student score comparison), deadlines (with urgency), application pathways (with links and admin tips), special features
- Student's exam scores compared against requirements (green ✓ / amber ⚠)
- Deadline days remaining with colour coding
- Fee waiver badges on pathways
- Dynamic route /student/universities/[id]
