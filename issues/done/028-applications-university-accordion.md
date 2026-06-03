## Parent PRD
`issues/prd.md`

## What to build
Applications page — grouped-by-university accordion view. Toggle between table view and university view. Each university as an expandable card showing pill summary (X applied, X planning, X total). Click to expand and see student rows inside with type, deadline, status, progress. No university rankings shown.

See PRD section 6.5 (applications — by university accordion).

## Acceptance criteria
- [ ] Toggle between "By application" and "By university" views
- [ ] University cards show name, country, flag, pill counts
- [ ] Click to expand/collapse student rows
- [ ] Student rows show type, deadline, status, progress
- [ ] "Planning" students shown slightly faded
- [ ] Filters work across both views
- [ ] No rankings displayed

## Blocked by
- `issues/027-applications-table-view.md`

## User stories addressed
- As a counsellor, I want to see how many students are applying to each university

---
## Completion notes
**Status: COMPLETE**
- Toggle between "By application" (flat table) and "By university" (grouped accordion) views
- Accordion: university cards with flag, pill counts (applied/planning/total)
- Click to expand/collapse student rows
- Filters work across both views
- Both views share same data source and search/status filter
