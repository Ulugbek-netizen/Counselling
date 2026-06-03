## Parent PRD
`issues/prd.md`

## What to build
Invitation system: Platform Admin invites School Admin by email. School Admin invites counsellors and students by email. Each invitation generates a unique link tied to the school and role. Clicking the link → create password → role assigned → routed to correct dashboard. Email delivery via Resend. Track invitation status (sent, accepted, expired).

See PRD section 6.2 (onboarding — invitation-only model).

## Acceptance criteria
- [ ] Platform Admin can invite School Admin (email + school name)
- [ ] School Admin can invite counsellors (email + name)
- [ ] School Admin or counsellor can invite students (email + name)
- [ ] Invitation email sent via Resend with unique link
- [ ] Link tied to correct school and role
- [ ] Click link → create password flow
- [ ] Invitation status tracking: sent, accepted, expired
- [ ] Expired links show friendly error with re-request option
- [ ] Invited user auto-associated with correct school

## Blocked by
- `issues/002-auth-role-based-routing.md`

## User stories addressed
- As a school admin, I want to invite counsellors and students to join the platform
- As a platform admin, I want to onboard new schools by inviting their admin

---
## Completion notes
**Status: COMPLETE**
- POST /api/invite: creates invitation with token, validates permissions
- Platform admin → school admin, School admin → counsellor/student, Counsellor → student
- 7-day expiry
- Accept invite page: validates token, creates account, sets school_id + role
- Marks invitation as accepted
- Redirects to correct dashboard
- Email delivery placeholder (Resend integration for production)
