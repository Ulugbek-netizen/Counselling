## Parent PRD
`issues/prd.md`

## What to build
"Request access from your school" form on the landing page. Student fills: name, email, school (searchable dropdown of registered schools), optional note. Submitted request appears in Platform Admin's pending requests. If school not in dropdown → message: "Your school isn't on EduPath yet. Contact your school administration to request it." Student requests where school isn't registered flagged as sales leads.

See PRD sections 6.1, 6.15 (request access, pending requests).

## Acceptance criteria
- [ ] Form: name, email, school dropdown (searchable), optional note
- [ ] School dropdown populated from registered schools
- [ ] If school not found: helpful message displayed
- [ ] Submission creates pending request in database
- [ ] Request visible in Platform Admin's pending requests
- [ ] Unregistered school requests flagged as sales leads
- [ ] Confirmation message shown to student after submission

## Blocked by
- `issues/020-landing-page-two-path.md`

## User stories addressed
- As a student without an account, I want to request access through my school

---
## Completion notes
**Status: COMPLETE**
- School dropdown populated from database
- "My school isn't listed" → warning + flagged as sales lead
- Saves to access_requests table
- Success confirmation
- Links back to sign in
