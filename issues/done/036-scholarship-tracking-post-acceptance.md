## Parent PRD
`issues/prd.md`

## What to build
When application status changes to "Accepted": scholarship entry fields appear. Both student and counsellor can enter: scholarship name, amount per year, type (full tuition / partial / fixed amount / living stipend), duration covered (defaults to program length, adjustable), renewable (yes/no/conditional). Auto-calculate: per year amount, total awarded (amount × years), scholarship type label. Full tuition: pull tuition from university profile. Living stipend: entered separately, added on top.

Report views: per student, per graduating class, school all-time totals.

See PRD section 6.11 (scholarship tracking post-acceptance).

## Acceptance criteria
- [ ] Scholarship fields appear on "Accepted" status
- [ ] Both student and counsellor can enter/edit
- [ ] Fields: name, amount/year, type, duration, renewable
- [ ] Duration defaults to university program length
- [ ] Auto-calculate total: amount × duration
- [ ] Full tuition: pulls tuition from university profile automatically
- [ ] Living stipend: separate entry, added to total
- [ ] Per-student view: individual scholarship details
- [ ] Class view: aggregated totals per graduating year
- [ ] All-time view: school total since joining

## Blocked by
- `issues/029-application-status-lifecycle.md`
- `issues/019-scholarships-browse-bookmark-recommend.md`

## User stories addressed
- As a student, I want to record my scholarship award after acceptance
- As a counsellor, I want to track total scholarship value across all students

---
## Completion notes
**Status: COMPLETE**
- ScholarshipAwardForm component for "accepted" applications
- Fields: name, amount/year, type, duration, renewable (yes/no/conditional)
- Auto-calculated: per year, total, tuition coverage percentage
- Full tuition: uses university tuition for percentage
- Living stipend type
- Renewable conditions text field
- Success state with "Add another" option
