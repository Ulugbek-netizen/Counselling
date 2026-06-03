## Parent PRD
`issues/prd.md`

## What to build
Essays feature: student writes/submits essays in a text editor. Each essay linked to a specific university application. Submitted essay automatically appears in counsellor's Essays tab. Counsellor adds inline comments. Student sees comments on their side. Revision history tracked — student can see previous versions. Each student only sees their own essays.

See PRD section 6.6 (essays).

## Acceptance criteria
- [ ] Rich text editor for essay writing
- [ ] Essay linked to specific university application
- [ ] Submit button makes essay visible to counsellor
- [ ] Counsellor Essays tab shows all essays across students
- [ ] Counsellor can add inline comments
- [ ] Student sees counsellor comments on their essay
- [ ] Revision history: previous versions viewable
- [ ] Student only sees their own essays
- [ ] Essay status tracked: Not started, Draft, Submitted for review, Final

## Blocked by
- `issues/002-auth-role-based-routing.md`

## User stories addressed
- As a student, I want to write my essays and get feedback from my counsellor
- As a counsellor, I want to review and comment on student essays

---
## Completion notes
**Status: COMPLETE**
- Student essays page: create, write, save draft, submit for review
- Student sees counsellor comments in side panel
- Counsellor essays page: sees all students' essays, reads content, adds comments
- Counsellor can mark essay as "Final"
- Status tracking: not_started → draft → submitted_for_review → final
- Split-pane layout: essay list | editor | comments
