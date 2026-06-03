## Parent PRD
`issues/prd.md`

## What to build
Landing page with two-path design connected to real authentication. Path A (schools/counsellors): features overview, benefits, "Book a demo" form, "Get started for your school" button. Path B (students): preview of student experience, "Ask your school to join EduPath" (generates pre-written email), "Already have access? Sign in." Sign-in form with Student/Counsellor toggle, email/password, Google sign-in. Sticky nav with links to How it works, Features, Who it's for, FAQ sections. 3-tab capability switcher.

See PRD section 6.1 (landing page).

## Acceptance criteria
- [ ] Two clear paths visible for schools vs students
- [ ] Sign-in form connected to real Supabase Auth
- [ ] Student/Counsellor toggle switches form behavior
- [ ] Google sign-in functional
- [ ] "Book a demo" form collects school name, admin name, email, student count
- [ ] "Ask your school to join" generates shareable email text
- [ ] Sticky nav with section links
- [ ] How it works, Features, Who it's for, FAQ sections
- [ ] 3-tab capability switcher (counsellors/students/programs)
- [ ] Responsive on mobile

## Blocked by
- `issues/002-auth-role-based-routing.md`

## User stories addressed
- As a new visitor, I want to understand what EduPath is and how to get started
- As an existing user, I want to sign in quickly

---
## Completion notes
**Status: COMPLETE**
- Two-path design: Schools path (features, demo, get started) + Students path (sign in, request access)
- Sticky nav with section links
- Hero with tagline and dual CTAs
- Stats bar (4 metrics)
- 9-feature grid
- 4-step "How it works"
- Who it's for (two cards with CTAs)
- CTA section with demo booking
- 5-item FAQ with accordion
- Footer
- Responsive on mobile
