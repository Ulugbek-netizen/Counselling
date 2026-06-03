## Parent PRD

`issues/prd.md`

## What to build

Mini calendar on the counsellor dashboard with month navigation. Events dot-coded on calendar days: red for application deadlines, purple for exams, green for birthdays, gold for sessions. Event list below the calendar showing upcoming events with type, student name, and date. Events pulled from real data across all students in the school.

See PRD section 6.3 (counsellor dashboard — calendar).

## Acceptance criteria

- [ ] Calendar renders current month with correct day layout
- [ ] Previous/next month navigation works
- [ ] Today highlighted
- [ ] Coloured dots on days with events (deadline, exam, birthday, session)
- [ ] Event list below calendar shows upcoming events sorted by date
- [ ] Events pull from real student data (applications, exams, birthdays, sessions)
- [ ] Only shows data for students in the counsellor's school

## Blocked by

- `issues/002-auth-role-based-routing.md`

## User stories addressed

- As a counsellor, I want a calendar view of all upcoming events across all my students

---
## Completion notes
**Status: COMPLETE**
- MiniCalendar client component with month navigation, dot-coded events, event list
- Calendar data query fetches deadlines, sessions, birthdays, exams with joins
- Integrated into counsellor dashboard (right column)
- 5 tests passing
Files: components/dashboard/mini-calendar.tsx, lib/queries/calendar-events.ts, app/counsellor/page.tsx updated
