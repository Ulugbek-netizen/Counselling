## Parent PRD

`issues/prd.md`

## What to build

First-time setup wizard that appears on a student's first login. Multi-step form: Step 1 — preferred majors (specific: Architecture, Civil Engineering, UX/UI Design, etc.), Step 2 — preferred countries (multi-select), Step 3 — exam scores (free-text exam name + score), Step 4 — budget range (Under $15k / $15k–$30k / $30k–$50k / $50k+ / No preference). All steps optional/skippable. Saves to student profile. If skipped entirely, Universities page shows prompt to complete profile.

See PRD section 6.2 (first-time setup wizard).

## Acceptance criteria

- [ ] Wizard appears only on first login (tracked via flag in database)
- [ ] 4 steps with progress indicator
- [ ] Each step skippable
- [ ] Preferred majors: free-text input with add/remove
- [ ] Preferred countries: multi-select
- [ ] Exam scores: free-text name + score (add multiple)
- [ ] Budget range: single select with "No preference" option
- [ ] Data saves to student profile
- [ ] Wizard does not reappear on subsequent logins
- [ ] If skipped, prompt shown on Universities page

## Blocked by

- `issues/002-auth-role-based-routing.md`

## User stories addressed

- As a student, I want the platform to understand my preferences so it can recommend relevant universities

---
## Completion notes
**Status: COMPLETE**
- 4-step modal wizard: majors, countries, exams, budget
- All steps optional/skippable
- Tag-based input for majors and countries (add/remove)
- Exam entries with free-text name + score
- Budget radio selection
- Skip setup option
- Shows on student layout when setup_completed=false
- Saves to profiles + student_exams tables
- Disappears after completion
- 3 tests
