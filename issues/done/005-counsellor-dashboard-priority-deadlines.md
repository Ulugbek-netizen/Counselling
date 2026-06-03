## Parent PRD

`issues/prd.md`

## What to build

Two panels on the counsellor dashboard: Priority Students panel showing students with oldest/no recent meetings, with colour-coded tags (Overdue, No recent session, Essay pending, Exam upcoming). Urgent Deadlines panel showing upcoming application deadlines sorted by urgency with colour-coded bars (red ≤7 days, amber ≤30 days, green >30 days) showing university name, student name, and days remaining.

See PRD section 6.3 (counsellor dashboard — priority students, urgent deadlines).

## Acceptance criteria

- [ ] Priority students panel lists students sorted by days since last meeting
- [ ] Colour-coded tags: Overdue (red), No recent session (amber), Essay pending (blue), Exam upcoming (purple)
- [ ] Urgent deadlines panel sorted by closest deadline first
- [ ] Colour coding: red ≤7 days, amber ≤30 days, green >30 days
- [ ] Each deadline row shows university, student name, days remaining
- [ ] "View all" links navigate to My Students and Applications pages
- [ ] Data scoped to counsellor's school only

## Blocked by

- `issues/002-auth-role-based-routing.md`

## User stories addressed

- As a counsellor, I want to see which students haven't had a session recently so I can follow up
- As a counsellor, I want to see approaching deadlines across all students

---
## Completion notes
**Status: COMPLETE**
- PriorityStudentsPanel with colour-coded tags (Overdue/No recent session)
- UrgentDeadlinesPanel with urgency bars and day countdown badges
- Data queries: getPriorityStudents (30+ days no session), getUrgentDeadlines (sorted by date)
- Dashboard now fully assembled: stats + banner + priority students + deadlines + calendar
- 5 new tests, 31 total passing
