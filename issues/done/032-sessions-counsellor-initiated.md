## Parent PRD
`issues/prd.md`

## What to build
Counsellor-initiated sessions: any counsellor can create a session with any student without restrictions. Student receives notification. School Admin "Show me as available counsellor to students" toggle — on by default, can turn off for purely administrative admins.

See PRD section 6.7 (sessions — counsellor-initiated, school admin toggle).

## Acceptance criteria
- [ ] Counsellor can create session: select student, date/time, subject
- [ ] Student receives notification of scheduled session
- [ ] No restrictions — any counsellor with any student
- [ ] School Admin toggle: "Show me as available counsellor"
- [ ] When toggled off, school admin doesn't appear in student's counsellor list
- [ ] When toggled on, school admin appears and can be requested

## Blocked by
- `issues/031-sessions-request-approval.md`

## User stories addressed
- As a counsellor, I want to schedule a meeting with any student proactively
- As a school admin, I want to choose whether students can request sessions with me

---
## Completion notes
**Status: COMPLETE**
- "Schedule session" button for counsellors: pick student, subject, date, time
- Counsellor-initiated sessions auto-approved (status: "approved")
- Student receives notification of scheduled session
- School Admin toggle (show_as_counsellor) already in settings from #007
- Combined with existing approve/reschedule/complete from #031
