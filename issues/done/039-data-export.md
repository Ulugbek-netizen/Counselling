## Parent PRD
`issues/prd.md`

## What to build
Data export for school admins. Export all student data as CSV or spreadsheet: student info, applications, exam scores, essay metadata, session history, documents list, scholarship awards. Accessible from School Admin panel or Settings.

See PRD section 7.4 (data export).

## Acceptance criteria
- [ ] Export button accessible to school admin
- [ ] Export includes: students, applications, exams, sessions, scholarships
- [ ] Output as CSV or XLSX
- [ ] Large exports handled with progress indicator
- [ ] Download link provided when export complete
- [ ] Only school admin can trigger full export

## Blocked by
- `issues/006-counsellor-my-students.md`

## User stories addressed
- As a school admin, I want to export our student data for external reporting or if we leave the platform

---
## Completion notes
**Status: COMPLETE**
- API route: GET /api/export → CSV download
- School admin exports own school students only
- Platform admin exports all students
- CSV with proper escaping (commas, quotes, arrays)
- Content-Disposition header triggers download
- Role guard: only school_admin and platform_admin
