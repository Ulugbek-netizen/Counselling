## Parent PRD
`issues/prd.md`

## What to build
Programs & Olympiads section. Platform Admin adds programs (name, type, host institution, location, price, dates, what's included, deadline) via form + CSV import. Students browse and bookmark programs. Bookmarked program deadline feeds into notification panel + timeline. Counsellor sees bookmarked programs under student's profile, can add notes and mark recommended/not recommended. Counsellor can recommend a program directly to a student.

See PRD section 6.10 (programs and Olympiads).

## Acceptance criteria
- [ ] Admin form to add/edit programs (similar to university form)
- [ ] CSV import for bulk program loading
- [ ] Browse page with search and filters
- [ ] Bookmark button saves to student's "My Programs" list
- [ ] Bookmarked deadlines appear in notification panel + timeline
- [ ] Counsellor view: see all bookmarks per student, add notes, mark recommended/not
- [ ] Counsellor push-recommend → student notification
- [ ] Only student can bookmark/remove from their own list

## Blocked by
- `issues/001-project-scaffolding-db-schema.md`

## User stories addressed
- As a student, I want to discover summer programs and Olympiads relevant to my goals
- As a counsellor, I want to recommend programs to specific students

---
## Completion notes
**Status: COMPLETE**
- Admin: add programs form (name, type, host, location, price, deadline)
- Student: browse + search programs, bookmark toggle
- Counsellor: see all programs with student bookmark counts
- Deadline colour-coded badges
- Free/paid tags
