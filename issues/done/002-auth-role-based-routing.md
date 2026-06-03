## Parent PRD

`issues/prd.md`

## What to build

Authentication system with email/password and Google sign-in via Supabase Auth. After sign-in, detect the user's role and route them to the correct dashboard shell: Platform Admin → admin dashboard, School Admin → counsellor dashboard (with admin badge), Counsellor → counsellor dashboard, Student → student dashboard. Protected routes — unauthenticated users see only the landing/sign-in page. Sign-out functionality.

See PRD sections 3.1 (roles), 6.1 (sign-in form), 6.2 (onboarding).

## Acceptance criteria

- [ ] Email/password sign-in works
- [ ] Google OAuth sign-in works
- [ ] Role detected from database after authentication
- [ ] Platform Admin routed to /admin dashboard shell
- [ ] School Admin routed to /counsellor dashboard shell with admin indicator
- [ ] Counsellor routed to /counsellor dashboard shell
- [ ] Student routed to /student dashboard shell
- [ ] Unauthenticated users redirected to sign-in
- [ ] Sign-out clears session and redirects to landing page
- [ ] Password reset flow functional

## Blocked by

- `issues/001-project-scaffolding-db-schema.md`

## User stories addressed

- As any user, I want to sign in securely and be taken to my correct dashboard
- As a platform admin, I want to access my admin dashboard without seeing student/counsellor UI

---

## Completion notes

**Status: COMPLETE**

- Email/password sign-in with role-based redirect
- Google OAuth sign-in with callback handling
- Password reset flow (request → email → update)
- Sign-out server action + reusable button component
- Auth routing utility extracted to lib/utils/auth.ts (shared by middleware, pages, callback)
- Middleware protects all non-public routes
- Auth callback handles both OAuth and password reset redirects
- Split-screen sign-in page with branding panel (desktop) and mobile-responsive layout
- 14 tests passing, 0 type errors

Files changed:
- app/(auth)/sign-in/page.tsx — full sign-in with Google OAuth
- app/(auth)/reset-password/page.tsx — password reset request
- app/(auth)/update-password/page.tsx — set new password
- app/auth/callback/route.ts — handles OAuth + reset redirects with role routing
- app/actions/sign-out.ts — server action
- components/ui/sign-out-button.tsx — reusable component
- lib/utils/auth.ts — getRedirectPath, isPublicPath, getRoleDashboardLabel
- lib/supabase/middleware.ts — updated to use shared utility
- __tests__/auth-routing.test.ts — 7 tests for routing logic
