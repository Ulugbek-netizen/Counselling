## Parent PRD

`issues/prd.md`

## What to build

Student dashboard home with 5 stat cards (universities on my list, applications submitted, essays in progress, days to next deadline, next meeting with counsellor). 3-column notification panel: Application deadlines, Scholarships & programs, Exams & tests. Each column sorted by urgency, capped at 5 items with "View all" link. Time filter toggle: This week / Next 30 days / All upcoming. Closest items first, far-away items slightly faded.

See PRD section 6.4 (student dashboard — stat cards, notification panel).

## Acceptance criteria

- [ ] 5 stat cards display real data from student's own records
- [ ] 3 notification columns render with correct data types
- [ ] Items sorted by urgency (closest deadline first)
- [ ] Capped at 5 per column with "View all X →" link
- [ ] Time filter toggles between This week / Next 30 days / All upcoming
- [ ] Colour-coded urgency: red ≤7 days, amber ≤30 days, green >30 days
- [ ] Far-away items slightly faded
- [ ] Only shows student's own data

## Blocked by

- `issues/002-auth-role-based-routing.md`

## User stories addressed

- As a student, I want to see my most urgent deadlines immediately when I log in
- As a student, I want to know when my next counsellor meeting is

---
## Completion notes
**Status: COMPLETE**
- Student sidebar with all 11 nav items across 3 groups
- Student layout with auth check + role guard
- 5 stat cards: universities, submitted, essays, days to deadline, next meeting
- 3-column notification panel with time filter (week/30 days/all)
- Capped at 5 items per column, urgency colour-coded
- Data queries for stats and notifications
- 3 tests, 38 total passing
