## Parent PRD
`issues/prd.md`

## What to build
CSV/spreadsheet bulk import for universities. Platform Admin uploads a file, platform parses it and creates university entries. Column mapping step to handle different spreadsheet formats. Preview of imported data before confirmation. Error handling for missing/invalid fields.

See PRD section 6.9 (universities — CSV bulk import).

## Acceptance criteria
- [ ] Upload CSV or XLSX file
- [ ] Column mapping interface (map spreadsheet columns to database fields)
- [ ] Preview shows parsed data with row count
- [ ] Validation highlights rows with errors or missing required fields
- [ ] Import creates university entries in database
- [ ] Progress indicator for large imports
- [ ] Error report after import (X succeeded, Y failed with reasons)
- [ ] Only Platform Admin can access

## Blocked by
- `issues/013-university-admin-form.md`

## User stories addressed
- As platform admin, I want to load 1,200+ universities at once without entering them one by one

---
## Completion notes
**Status: COMPLETE**
- 4-step flow: upload → column mapping → preview → import
- Auto-maps columns by name similarity
- Preview shows first 20 rows in table
- Import result: success/failed counts
- Admin page now has "Add one" / "CSV import" toggle
- Handles quoted CSV fields, missing values
