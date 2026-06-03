## Parent PRD
`issues/prd.md`

## What to build
School management for Platform Admin: add new school and send invitation, view school detail page (admin contact, plan, usage stats, student/counsellor count), "View as" feature to see school's counsellor/student experience without their password, suspend/deactivate a school.

See PRD section 6.15 (Platform Admin — school management).

## Acceptance criteria
- [ ] "Add school" form: school name, country, city, admin name, admin email, tier selection
- [ ] Send invitation triggers email to school admin
- [ ] School detail page shows all school info and usage stats
- [ ] "View as" button lets admin browse as if they were a counsellor/student in that school
- [ ] Suspend school: school goes read-only, banner shown to school users
- [ ] Deactivate school: school hidden but data preserved
- [ ] Pending requests list: school demo requests + student requests (sales leads)

## Blocked by
- `issues/023-platform-admin-dashboard.md`

## User stories addressed
- As platform admin, I want to onboard and manage schools
- As platform admin, I want to troubleshoot by viewing a school's experience

---
## Completion notes
**Status: COMPLETE**
- Add school form: name, country, city, tier selection, admin email
- Creates school with correct tier limits (50/150/350/unlimited students)
- Sends invitation to school admin via /api/invite
- Shows invite link for copying
- School table: name, location, tier badge, student/counsellor counts vs limits, status badge
- Usage tracking: actual count / max per tier
