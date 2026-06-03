## Parent PRD

`issues/prd.md`

## What to build

Horizontal scrollable Gantt-style timeline on the student dashboard. One row per university on the student's list showing: coloured work-period bar (writing/in progress/planning), red dot for application deadline, green dot for decision date. Vertical red "today" line cutting across all rows. Exams & tests row at the bottom pinning SAT/IELTS/etc to the same timeline. Covers full academic year with month labels. Horizontally scrollable.

See PRD section 6.4 (student dashboard — timeline).

## Acceptance criteria

- [ ] One row per university on the student's list
- [ ] Work-period bars coloured by status (amber=in progress, red=urgent, green=planning)
- [ ] Red deadline dots and green decision dots positioned correctly on timeline
- [ ] Vertical red "today" line visible across all rows
- [ ] Exams row at bottom shows planned exam dates
- [ ] Month labels across the top
- [ ] Horizontal scroll covers September–December of academic year
- [ ] Data pulled from student's real applications and exam entries

## Blocked by

- `issues/002-auth-role-based-routing.md`

## User stories addressed

- As a student, I want a visual overview of my entire application year so I can see what's ahead

---
## Completion notes
**Status: COMPLETE**
- Horizontal scrollable Gantt-style timeline
- One row per university with coloured bar, deadline dot (red), decision dot (green)
- Today line (red vertical)
- Exams row at bottom with blue pins
- Month headers (Sep–Aug academic year)
- Legend
- Empty state
- Data query converts calendar months to academic year months
- Integrated into student dashboard
- 5 tests
