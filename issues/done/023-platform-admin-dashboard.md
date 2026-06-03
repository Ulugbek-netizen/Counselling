## Parent PRD
`issues/prd.md`

## What to build
Platform Admin dashboard home: 4 stat cards (total schools active, total students across schools, monthly revenue from Stripe, pending requests count). Recent activity log (school joins, subscription renewals, new requests). Subscription alerts (expiring soon, payment failed, schools near tier limit). Schools overview table (name, country, tier, student count vs limit, status).

See PRD section 6.15 (Platform Admin dashboard).

## Acceptance criteria
- [ ] 4 stat cards with real data
- [ ] Recent activity log with timestamped entries
- [ ] Subscription alerts panel
- [ ] Schools table sortable by name, status, student count
- [ ] Click school row → navigate to school detail page
- [ ] Only accessible by Platform Admin role

## Blocked by
- `issues/001-project-scaffolding-db-schema.md`

## User stories addressed
- As platform admin, I want an overview of all schools and the platform's health

---
## Completion notes
**Status: COMPLETE**
- Admin layout with sidebar (7 nav items)
- Dashboard: 4 stat cards (schools, students, revenue placeholder, pending requests)
- Schools list with tier badges
- Activity log placeholder
- Stub pages for all admin sections
- Role guard (platform_admin only)
