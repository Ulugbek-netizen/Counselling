## Parent PRD
`issues/prd.md`

## What to build
Applications page — flat table view. One row per application (not per student). Columns: student (avatar + name + grade), university, type (EA/RD/REA), deadline date, days left (colour-coded badge), status, essay status, progress bar. Filters: free-text search, student picker, status filter, type filter, deadline window filter.

See PRD section 6.5 (applications — by application table).

## Acceptance criteria
- [ ] Table renders one row per active application
- [ ] All columns populated from real data
- [ ] Days-left badges: red ≤7, amber ≤30, green >30
- [ ] Status badges: Missing docs, In progress, On track, Submitted
- [ ] Essay column: Not started, Draft, Final
- [ ] Progress bar reflects completion percentage
- [ ] Filters: search, student, status, type, deadline range
- [ ] Counsellor sees all students' applications
- [ ] Student sees only their own applications

## Blocked by
- `issues/026-two-stage-university-bookmarking.md`

## User stories addressed
- As a counsellor, I want to see all applications across students sorted by urgency
- As a student, I want to see all my applications in one place

---
## Completion notes
**Status: COMPLETE**
- Counsellor: all applications table with search, status filter, type filter
- Student: own applications table
- Columns: student, university, type, deadline, days left (colour badge), status, progress bar
- Application count badge
- Real-time data from applications + profiles + universities joins
