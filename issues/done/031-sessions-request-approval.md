## Parent PRD
`issues/prd.md`

## What to build
Session request flow: student sees list of all counsellors in their school. Request form: subject/note, preferred date and time, which counsellor. Counsellor receives request notification → approves or reschedules (suggest new time). Once approved → appears in student's notification bar + Sessions page. Session history tracked.

See PRD section 6.7 (sessions — student-initiated).

## Acceptance criteria
- [ ] Student sees all counsellors in their school
- [ ] Request form: subject, preferred date/time, counsellor selector
- [ ] Counsellor receives notification of new request
- [ ] Counsellor can approve (keeps time) or reschedule (suggest new time)
- [ ] If rescheduled, student sees new proposed time and confirms
- [ ] Approved session appears in student notifications + Sessions page
- [ ] Approved session appears on counsellor calendar
- [ ] Session history: list of past and upcoming sessions per student

## Blocked by
- `issues/002-auth-role-based-routing.md`

## User stories addressed
- As a student, I want to request a meeting with any counsellor at my school
- As a counsellor, I want to manage incoming session requests

---
## Completion notes
**Status: COMPLETE**
- Student: see all counsellors, request session (counsellor, subject, date, time)
- Counsellor: see all requests, approve, reschedule (propose new time), mark complete
- Status flow: requested → approved/rescheduled → completed
- Session table with status badges and action buttons
- Inline reschedule form
