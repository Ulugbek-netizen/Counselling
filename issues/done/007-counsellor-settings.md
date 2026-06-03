## Parent PRD

`issues/prd.md`

## What to build

Counsellor settings page: change password, update profile photo, language preference, notification preferences (toggle which alerts to receive), edit professional info (title, department), manage availability for sessions (set available time slots).

See PRD section 6.13 (counsellor settings).

## Acceptance criteria

- [ ] Change password form with current/new/confirm fields
- [ ] Profile photo upload and preview
- [ ] Language preference selector
- [ ] Notification preferences: toggles for each alert type
- [ ] Professional info: editable title and department fields
- [ ] Availability management: set available days/times for sessions
- [ ] All changes save to database and reflect immediately

## Blocked by

- `issues/002-auth-role-based-routing.md`

## User stories addressed

- As a counsellor, I want to manage my profile and availability settings

---
## Completion notes
**Status: COMPLETE**
- Professional info: title, department, phone, email (read-only)
- "Show me as available counsellor" toggle
- Change password form with validation
- Save with success feedback
