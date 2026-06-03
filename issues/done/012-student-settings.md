## Parent PRD
`issues/prd.md`

## What to build
Student settings page with: language preference selector, notification preferences (toggle which alerts), change password form. No access to edit name, birthday, or photo (counsellor-managed).

See PRD section 6.13 (student settings).

## Acceptance criteria
- [ ] Language preference dropdown saves and applies
- [ ] Notification toggles for each alert type
- [ ] Change password form with current/new/confirm
- [ ] No personal info fields visible in settings (handled in profile by counsellor)

## Blocked by
- `issues/002-auth-role-based-routing.md`

## User stories addressed
- As a student, I want to control my notification preferences and language

---
## Completion notes
**Status: COMPLETE**
- Change password with validation
- Notification preference toggles (5 types)
- Note explaining counsellor-managed fields
- No access to edit personal info (as per PRD)
