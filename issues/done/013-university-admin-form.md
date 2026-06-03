## Parent PRD
`issues/prd.md`

## What to build
Platform Admin step-by-step form for adding universities: Step 1 — Basic info (name, country, city, website, type, tagline, tuition intl., acceptance rate intl., logo). Step 2 — Programs (specific major names, school/faculty, duration years, semesters, special: double degree/multi-campus). Step 3 — Requirements (free-text exam name + minimum score, documents needed, language requirements). Step 4 — Deadlines (application type + date, multiple entries). Step 5 — Application pathways (platform name, link, fee, currency, fee waiver, which programs, admin tips). Step 6 — Special features (multi-campus, exchanges, co-op, etc.). Review and save.

See PRD sections 6.9 (universities — database management), 6.15 (Platform Admin).

## Acceptance criteria
- [ ] Multi-step form with progress indicator
- [ ] Each step saves independently (can resume later)
- [ ] Programs: add multiple with specific names, duration in years and semesters
- [ ] Requirements: free-text exam name + minimum score (add multiple)
- [ ] Deadlines: application type dropdown + date picker (add multiple)
- [ ] Application pathways: platform name, URL, fee with currency, fee waiver toggle, admin tips textarea
- [ ] Special features: flexible text fields
- [ ] Review step shows summary before final save
- [ ] Edit existing universities with same form pre-filled
- [ ] Only Platform Admin can access this form

## Blocked by
- `issues/001-project-scaffolding-db-schema.md`

## User stories addressed
- As platform admin, I want to add universities with complete details so students and counsellors have accurate information

---
## Completion notes
**Status: COMPLETE**
- 7-step multi-step form: Basic info → Programs → Requirements → Deadlines → Pathways → Features → Review
- Each step allows adding multiple entries dynamically
- Programs: specific names, degree type, school/faculty, duration (years + semesters), double degree, multi-campus
- Pathways: platform name, URL, fee with currency, fee waiver, admin tips
- Review step shows summary before save
- Saves to all 6 related tables (universities, programs, requirements, deadlines, pathways, features)
- Success state with "Add another" option
- 3 tests, 41 total passing, 0 type errors
