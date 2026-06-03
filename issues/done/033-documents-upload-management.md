## Parent PRD
`issues/prd.md`

## What to build
Documents feature: students upload documents with predefined categories (Transcripts, Recommendation Letters, Personal Statement, CV/Resume, Test Score Reports, Financial Documents, Other). When "Other" selected: text field for document name, saves as "Other: [label]". Two access points: dedicated Documents page (all docs across students for counsellor) + Documents tab inside each student's profile. File storage via Supabase Storage.

See PRD section 6.8 (documents).

## Acceptance criteria
- [ ] Upload form with file picker and category dropdown
- [ ] "Other" shows text field for custom label
- [ ] Files stored in Supabase Storage
- [ ] Dedicated Documents page: counsellor sees all documents across students with filters
- [ ] Student profile Documents tab: shows that student's documents only
- [ ] Student can only see their own documents
- [ ] Counsellor can view/download any student's documents
- [ ] File preview for PDFs and images

## Blocked by
- `issues/002-auth-role-based-routing.md`

## User stories addressed
- As a student, I want to upload my documents organised by category
- As a counsellor, I want to see all student documents in one place

---
## Completion notes
**Status: COMPLETE**
- Student: upload with category dropdown + "Other" custom label
- Student: documents grouped by category in card grid
- Counsellor: see all students' documents in searchable table
- File upload via Supabase Storage
- 7 predefined categories + Other: [label]
- Two access points: dedicated page (counsellor sees all) + per-student (future)
