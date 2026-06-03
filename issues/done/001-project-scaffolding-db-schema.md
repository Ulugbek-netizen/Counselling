## Parent PRD

`issues/prd.md`

## What to build

Set up the full project foundation: Next.js app deployed to Vercel, Supabase project with Postgres database. Create all core tables: schools, users (with role enum: platform_admin, school_admin, counsellor, student), universities, programs, applications, essays, sessions, documents, scholarships, olympiad_programs, chat_messages, broadcasts, notifications, exams, bookmarks. Set up row-level security policies per role. Deploy initial empty app to Vercel with Supabase connection verified.

See PRD sections 3.1 (roles), 3.2 (multi-school architecture), 8.1 (tech stack).

## Acceptance criteria

- [ ] Next.js project created and deployed to Vercel with live URL
- [ ] Supabase project connected with environment variables configured
- [ ] All core database tables created with correct relationships and foreign keys
- [ ] Row-level security enabled — schools are isolated workspaces
- [ ] Role enum (platform_admin, school_admin, counsellor, student) on users table
- [ ] School-scoped queries: users in School A cannot query School B data
- [ ] Database migrations committed and reproducible

## Blocked by

None — can start immediately.

## User stories addressed

- Foundation for all features across the platform

---

## Completion notes

**Status: COMPLETE**

- Next.js 15 project with App Router created
- Supabase client configured (server, browser, middleware)
- Database migration with 25+ tables, enums, indexes, RLS policies, and helper functions
- TypeScript types for all database entities
- Auth flow: sign-in → role detection → route to correct dashboard
- Middleware protects routes, redirects unauthenticated users
- Vitest test suite: 7 tests passing
- TypeScript strict mode: 0 errors
- Project structure follows PRD specification
