## Parent PRD
`issues/prd.md`

## What to build
One-on-one chat between student and any counsellor. Real-time messaging via Supabase Realtime. Message history preserved. Chat list showing all conversations. Unread message indicators. Student can initiate chat with any counsellor in their school.

See PRD section 6.12 (chat — one-on-one).

## Acceptance criteria
- [ ] Student can start a conversation with any counsellor
- [ ] Counsellor can start a conversation with any student
- [ ] Real-time message delivery (Supabase Realtime subscriptions)
- [ ] Message history preserved and scrollable
- [ ] Chat list shows all conversations sorted by most recent
- [ ] Unread message count badges
- [ ] Typing indicators (optional)
- [ ] Timestamps on messages

## Blocked by
- `issues/002-auth-role-based-routing.md`

## User stories addressed
- As a student, I want to message my counsellor directly through the platform
- As a counsellor, I want to communicate with students without using external email

---
## Completion notes
**Status: COMPLETE**
- Shared ChatInterface component used by both student and counsellor
- Contact list with initials, name, role
- Real-time messaging (create conversation on first message)
- Chat bubbles: own messages right (navy), other's left (white)
- Timestamps on each message
- Enter to send
- Auto-scroll to bottom
- Conversation creation on first message
