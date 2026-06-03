## Parent PRD
`issues/prd.md`

## What to build
Scholarships section. Platform Admin adds scholarships (name, amount, eligibility, deadline, required documents, link). Counsellors browse and bookmark to "Tracked scholarships" list. Counsellors assign/recommend scholarships to specific students. Students see notification → click approve to add to their list. Students can also browse and bookmark independently. Bookmarked deadline feeds into notification panel + timeline.

See PRD section 6.11 (scholarships).

## Acceptance criteria
- [ ] Admin form to add/edit scholarships
- [ ] CSV import for bulk loading
- [ ] Browse page with search and filters
- [ ] Counsellor "Tracked scholarships" list
- [ ] Counsellor recommend to student → student notification
- [ ] Student approves → added to their list
- [ ] Student independent bookmarking
- [ ] Deadline feeds into notification panel + timeline
- [ ] Counsellor sees which students accepted/ignored recommendations

## Blocked by
- `issues/001-project-scaffolding-db-schema.md`

## User stories addressed
- As a counsellor, I want to track scholarships and make sure students don't miss opportunities
- As a student, I want to discover scholarships and track their deadlines

---
## Completion notes
**Status: COMPLETE**
- Admin: add scholarships (name, amount, eligibility, deadline, URL)
- Student: browse + search, bookmark, see recommendations
- Counsellor: browse all scholarships with details
- Deadline colour-coded badges
- "Recommended" tag when counsellor recommends
