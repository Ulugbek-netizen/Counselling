# EduPath — Build Instructions

You are building EduPath, a multi-school SaaS college counselling platform.

## Tech Stack

- **Frontend:** Next.js 15 (App Router) + Tailwind CSS
- **Backend/DB:** Supabase (Postgres, Auth, Realtime, Storage, Edge Functions)
- **Payments:** Stripe
- **Email:** Resend
- **Deployment:** Vercel
- **Language:** TypeScript throughout

## Project Structure

```
edupath/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth pages (sign-in, sign-up, reset)
│   ├── (landing)/          # Public landing page
│   ├── admin/              # Platform Admin dashboard
│   ├── counsellor/         # Counsellor dashboard + pages
│   ├── student/            # Student dashboard + pages
│   └── api/                # API routes (webhooks, etc.)
├── components/             # Shared UI components
│   ├── ui/                 # Base components (buttons, cards, inputs)
│   ├── dashboard/          # Dashboard-specific components
│   ├── universities/       # University cards, profile, filters
│   └── layout/             # Sidebar, topbar, nav
├── lib/                    # Utilities
│   ├── supabase/           # Supabase client, helpers, types
│   ├── stripe/             # Stripe helpers
│   └── utils/              # General utilities
├── types/                  # TypeScript types
├── supabase/
│   └── migrations/         # Database migrations (SQL)
└── public/                 # Static assets
```

## Design System

- Font: DM Sans (body) + DM Serif Display (headings)
- Primary: #0E1E3D (navy)
- Accent: #C9933A (gold)
- Background: #F9F6F0 (cream)
- Border: #EDE8DC (cream-mid)
- Status colours: red (#C0392B), amber (#B7770D), green (#1A7F6E), blue (#2563EB), purple (#6D28D9)
- Border radius: 10px default, 14px cards
- Approach: clean, editorial, warm — not generic SaaS. Avoid Inter font. Avoid purple gradients.

## Roles

4 roles with strict row-level security:
1. **Platform Admin** — sees all schools, manages databases
2. **School Admin** — manages their school + works as counsellor
3. **Counsellor** — full access to all students in their school
4. **Student** — personal view only

Schools are isolated workspaces. All counsellors within a school see all students (open access).

## Rules

- Always use TypeScript with strict types
- Always use Supabase Row Level Security — never bypass it
- Use server components by default, client components only when needed (interactivity)
- Use Supabase Auth for all authentication — no custom auth
- Every database query must be scoped to the user's school (except Platform Admin)
- Use Tailwind CSS — no separate CSS files
- Keep components small and reusable
- Handle loading states and error states
- Mobile responsive — but desktop-first since counsellors use laptops

---

# ISSUES

Local issue files from `issues/` are provided at start of context. Parse them to understand the open issues.
You will work on the AFK issues only, not the HITL ones.
You've also been passed a file containing the last few commits. Review these to understand what work has been done.
If all AFK tasks are complete, output <promise>NO MORE TASKS</promise>.

# TASK SELECTION

Pick the next task. Prioritize tasks in this order:
1. Critical bugfixes
2. Development infrastructure
Getting development infrastructure like tests and types and dev scripts ready is an important precursor to building features.
3. Tracer bullets for new features
Tracer bullets are small slices of functionality that go through all layers of the system, allowing you to test and validate your approach early. This helps in identifying potential issues and ensures that the overall architecture is sound before investing significant time in development.
TL;DR - build a tiny, end-to-end slice of the feature first, then expand it out.
4. Polish and quick wins
5. Refactors

# EXPLORATION

Explore the repo.

# IMPLEMENTATION

Use /tdd to complete the task.

# FEEDBACK LOOPS

Before committing, run the feedback loops:
- `npm run test` to run the tests
- `npm run typecheck` to run the type checker

# COMMIT

Make a git commit. The commit message must:
1. Include key decisions made
2. Include files changed
3. Blockers or notes for next iteration

# THE ISSUE

If the task is complete, move the issue file to `issues/done/`.
If the task is not complete, add a note to the issue file with what was done.

# FINAL RULES

ONLY WORK ON A SINGLE TASK.
