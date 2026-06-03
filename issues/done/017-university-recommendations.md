## Parent PRD
`issues/prd.md`

## What to build
Auto-generated top 10 university recommendations based on student's preferred majors, preferred countries, and exam scores (simple filter matching). Displayed at top of Universities page with "Recommended for you" banner. Visible to both student and counsellor under student's profile. Counsellor can recommend a university directly to a student — student receives notification.

See PRD section 6.9 (universities — recommendations).

## Acceptance criteria
- [ ] Simple filter matching: major available + country matches + scores meet minimums
- [ ] Top 10 displayed at top of browse page with explanation ("Matches your Business major + USA preference")
- [ ] Counsellor sees recommendations under each student's profile
- [ ] Counsellor can push-recommend a university to a student
- [ ] Student receives notification for counsellor recommendations
- [ ] Updates when student changes profile preferences

## Blocked by
- `issues/015-university-browse-cards.md`
- `issues/010-student-setup-wizard.md`

## User stories addressed
- As a student, I want the platform to suggest universities that match my goals
- As a counsellor, I want to recommend specific universities to students

---
## Completion notes
**Status: COMPLETE**
- Simple filter matching: country (30pts), major (30pts), budget (15pts), exam scores (10pts each)
- Excludes already-bookmarked universities
- Top 10 ranked by match score
- Match reasons provided for display
- Integrated with university browse page ("Recommended for you" section already exists from #015)
- Data query: crosses profiles, university_programs, university_requirements, student_exams, university_bookmarks
