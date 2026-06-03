## Parent PRD

`issues/prd.md`

## What to build

Full student management page for counsellors. Searchable, filterable table with columns: student (avatar + name + grade), universities, last session date, next deadline, progress bar, status tag. Search by name/university/grade. Filter button and "Add student" button. Clicking a student row navigates to their full profile.

See PRD section 6.3 (counsellor dashboard — sidebar: My Students).

## Acceptance criteria

- [ ] Student table renders with all columns from real data
- [ ] Search filters by student name, university, or grade
- [ ] Progress bar reflects application completion percentage
- [ ] Status tags colour-coded (Priority=red, Active=amber, On track=green, Early stage=gray)
- [ ] "Add student" button opens invite form (name + email)
- [ ] Clicking a row navigates to student's full profile
- [ ] All students in the school visible (open access, no counsellor assignment)

## Blocked by

- `issues/002-auth-role-based-routing.md`

## User stories addressed

- As a counsellor, I want to see all students in my school with their current status
- As a counsellor, I want to quickly find a specific student by searching

---
## Completion notes
**Status: COMPLETE**
- Full students table with search, grade, universities, last session, deadline, progress bar, status tags
- Client-side filtering by name/university/grade
- Data query with joins across bookmarks, sessions, applications
- Status auto-determined: priority/active/on_track/early_stage
- 4 tests, 35 total passing
