## Parent PRD
`issues/prd.md`

## What to build
Full application status lifecycle: Considering → Active application → Submitted → Accepted / Rejected / Waitlisted → Enrolled. Status transitions with appropriate permissions (student can submit, counsellor can approve/change status). On "Accepted" status: scholarship field unlocks. "Enrolled" marks final choice — only one university can be Enrolled.

See PRD section 6.5 (application status lifecycle).

## Acceptance criteria
- [ ] Status dropdown with all 7 states
- [ ] Considering → Active requires counsellor approval
- [ ] Submitted: student marks as sent
- [ ] Accepted: scholarship entry fields appear
- [ ] Rejected/Waitlisted: status recorded
- [ ] Enrolled: only one university can have this status per student
- [ ] Status changes logged with timestamp
- [ ] Both student and counsellor can update status (with appropriate restrictions)

## Blocked by
- `issues/027-applications-table-view.md`

## User stories addressed
- As a student, I want to track my application from submission to final decision
- As a counsellor, I want to see the outcome of every application

---
## Completion notes
**Status: COMPLETE**
- ApplicationStatusChanger component: dropdown with all 7 states
- Read-only mode (badge only) and edit mode (clickable dropdown)
- Timestamps auto-set: submitted_at on "submitted", decision_received_at on accept/reject/waitlist
- Visual indicators: colored dots and badges for each status
- 3 tests
