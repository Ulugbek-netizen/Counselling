## Parent PRD

`issues/prd.md`

## What to build

Counsellor dashboard home page with 4 stat cards (total students, active applications with "need attention" count, priority students with no meeting 30+ days, deadlines this month) pulling real data from the database. Dismissable weekly notification banner showing current-week events: urgent deadlines, tomorrow's sessions, student birthdays, upcoming exams. Events disappear after they pass.

See PRD section 6.3 (counsellor dashboard — stat cards, notification banner).

## Acceptance criteria

- [ ] 4 stat cards display real counts from database
- [ ] Notification banner shows events for the current week only
- [ ] Events colour-coded by type (red=deadline, gold=session, green=birthday, purple=exam)
- [ ] Banner dismissable — stays hidden for the session
- [ ] Past events automatically removed from banner
- [ ] Stat cards link to relevant pages (students, applications, etc.)

## Blocked by

- `issues/002-auth-role-based-routing.md`

## User stories addressed

- As a counsellor, I want to see at a glance how many students need attention without checking each one
- As a counsellor, I want to know what's happening this week the moment I log in

---

## Completion notes

**Status: COMPLETE**

Key decisions:
- Counsellor sidebar extracted as reusable client component with active state highlighting
- Layout wraps all /counsellor/* pages with sidebar + main area
- Topbar component reusable across all dashboard pages
- StatCard and NotificationBanner are generic, reusable components
- Dashboard queries use `any` typed Supabase client to avoid generic type issues at this stage
- Banner events computed server-side from real DB queries (deadlines, sessions, birthdays, exams)
- Placeholder panels for calendar (#004) and priority students (#005) with clear labels

Files created/changed:
- components/layout/counsellor-sidebar.tsx — full sidebar with 3 nav sections
- components/layout/topbar.tsx — reusable topbar
- components/dashboard/stat-card.tsx — stat card component
- components/dashboard/notification-banner.tsx — dismissable event banner
- lib/queries/counsellor-dashboard.ts — getDashboardStats, getThisWeekEvents
- app/counsellor/layout.tsx — layout with sidebar + auth check
- app/counsellor/page.tsx — dashboard with stats + banner + placeholders
- __tests__/stat-card.test.tsx — 4 tests
- __tests__/notification-banner.test.tsx — 3 tests

Tests: 21 passing | Type errors: 0
