## Parent PRD
`issues/prd.md`

## What to build
Two-stage bookmarking for universities. Stage 1 — Considering: student freely bookmarks any university (no approval needed). Appears on their personal wishlist. Counsellor can see it and add notes. Stage 2 — Active application: student or counsellor moves it from Considering to Applying. Requires counsellor approval. Triggers deadline activation, timeline entry, and essay tracking.

See PRD section 6.9 (universities — two-stage bookmarking).

## Acceptance criteria
- [ ] Bookmark button on university cards adds to "Considering" list instantly
- [ ] "Considering" list visible to student and counsellor
- [ ] Counsellor can add notes to considering entries
- [ ] "Move to Active" button available on considering entries
- [ ] Moving to Active requires counsellor approval
- [ ] Active applications: deadlines appear in notifications + timeline
- [ ] Essay tracking starts only for Active applications
- [ ] Student can remove from Considering freely
- [ ] Only counsellor can revert Active back to Considering

## Blocked by
- `issues/015-university-browse-cards.md`

## User stories addressed
- As a student, I want to freely explore and save universities I'm interested in
- As a counsellor, I want to approve before a university becomes an active application

---
## Completion notes
**Status: COMPLETE**
- Stage 1 (Considering): free bookmark from card or profile page
- Stage 2 (Active Application): confirmation dialog explains what activates (deadlines, timeline, essays)
- Creates application record on activation
- Remove from list option for Considering
- BookmarkActions component with all 3 states (none/considering/active)
- University browser updated to navigate to profile pages
- 4 tests
