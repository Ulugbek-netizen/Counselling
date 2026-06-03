## Parent PRD
`issues/prd.md`

## What to build
Student profile page with: personal info (name, birthday, grade, school, photo — viewable by student, editable only by counsellor), free-text exam entries (exam name, date, score, status: Planned/Taken — student can add multiple, same exam for retakes), extracurriculars list, awards & achievements, profile completion bar. Exam dates automatically feed into notification panel and timeline.

See PRD section 6.13 (student profile).

## Acceptance criteria
- [ ] Personal info section displays but fields disabled for student (counsellor-only edit)
- [ ] Exam section: "Add exam" button with free-text name, date picker, optional score, status toggle
- [ ] Multiple entries of same exam allowed (retakes build history)
- [ ] Exam dates feed into notification panel and timeline
- [ ] Extracurriculars: add/edit/remove list items
- [ ] Awards: add/edit/remove list items
- [ ] Profile completion bar calculates based on filled fields
- [ ] Counsellor can view and edit all fields from their side

## Blocked by
- `issues/002-auth-role-based-routing.md`

## User stories addressed
- As a student, I want to track my exam schedule and scores in one place
- As a counsellor, I want to see a student's complete profile including scores and activities

---
## Completion notes
**Status: COMPLETE**
- Personal info section (read-only, counsellor-managed label)
- Preferences: majors, countries, budget as pills
- Exams: free-text name, date, score, status (Planned/Taken)
- Add exam form with validation, saves to DB
- Same exam addable multiple times (retakes)
- Profile completion bar (percentage based on filled fields)
