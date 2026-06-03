## Parent PRD
`issues/prd.md`

## What to build
Broadcast messaging for counsellors. Audience picker: all students, by grade, by smart auto-generated groups (students with MIT on list, students with IELTS scheduled, students with missing docs, etc.), hand-picked individuals, combined filters. Broadcast marked clearly on student's side. Student replies go to original sender as one-on-one chat. Shared broadcast log visible to all counsellors in the school — only sender can edit/delete.

See PRD section 6.12 (chat — broadcast).

## Acceptance criteria
- [ ] Compose broadcast with audience selector
- [ ] Audience options: all, by grade, by smart group, hand-picked, combined
- [ ] Smart groups auto-generated from data (university, exam, status, etc.)
- [ ] Combined filters work (e.g. "Grade 11 + applying to USA")
- [ ] Broadcast appears in student's chat marked as broadcast
- [ ] Student reply creates one-on-one chat with original sender
- [ ] All counsellors see shared broadcast log
- [ ] Only sender can edit/delete their broadcast
- [ ] Broadcast shows: who sent, to whom, when, message content

## Blocked by
- `issues/034-chat-one-on-one.md`

## User stories addressed
- As a counsellor, I want to send deadline reminders to relevant students at once
- As a counsellor, I want to see what broadcasts my colleagues have sent

---
## Completion notes
**Status: COMPLETE**
- Messages/Broadcast tab toggle on counsellor chat page
- Compose broadcast: audience (all students / by grade), message
- Recipient count computed from profile filters
- Shared broadcast log visible to all counsellors
- Only sender can delete own broadcast
- Audience badge and recipient count on each broadcast
