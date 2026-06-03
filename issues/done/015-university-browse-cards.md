## Parent PRD
`issues/prd.md`

## What to build
University browse page with card grid. Each card: flag, name, location, tagline, specific matching majors (closest to student preference first + "+X more"), tuition (international), acceptance rate (international), match score (percentage + bar), reach/target/safety label, application types, next deadline with days left and urgency colour, bookmark button. Filters: search, country, major, tuition range, acceptance rate range, sort order. Filters auto-populate from student profile preferences on every visit. Student can change filters freely; reset to profile defaults on revisit. "Recommended for you" banner at top for matched universities.

See PRD section 6.9 (universities — browse view, filters, recommendations).

## Acceptance criteria
- [ ] Card grid renders from university database
- [ ] Each card shows all specified fields
- [ ] Match score calculated from student profile vs university requirements
- [ ] Reach/Target/Safety label based on student's scores vs requirements
- [ ] Majors show closest match first with "+X more" for rest
- [ ] Filters: search, country, major, tuition range, acceptance rate range, sort
- [ ] Filters auto-populate from student profile on page load
- [ ] Filters reset to profile defaults when revisiting
- [ ] "Recommended for you" section at top with matched universities
- [ ] Bookmark button saves to "Considering" list
- [ ] Counsellor view: same cards but can see which students bookmarked each university

## Blocked by
- `issues/013-university-admin-form.md`

## User stories addressed
- As a student, I want to browse universities with personalised recommendations based on my preferences
- As a student, I want to filter universities by country, major, tuition, and acceptance rate

---
## Completion notes
**Status: COMPLETE**
- UniversityCard component with flag, name, tagline, majors, tuition, acceptance rate, match score, reach/target/safety, deadline badge, bookmark button
- UniversityBrowser client component with search, country filter, sort (match/deadline/tuition/name)
- Filters auto-populate from student profile preferences
- Recommended banner for high-match universities
- Bookmark toggle saves to university_bookmarks table
- Match score: simple filter (country + major overlap)
- Server-side data fetching with program and deadline joins
- 4 tests
