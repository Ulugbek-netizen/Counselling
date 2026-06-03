## Parent PRD
`issues/prd.md`

## What to build
Tier limit enforcement. Track student and counsellor count per school vs their tier limit. When school hits limit: school admin sees "You've reached your plan limit. Contact us to upgrade." Cannot add more students/counsellors. Existing users unaffected. Platform Admin receives notification. 7-day grace period on subscription expiry — school works normally with warning banner. After 7 days: school goes read-only (view but not add/edit). Data never deleted.

See PRD sections 7.3–7.4 (limit enforcement, subscription lifecycle).

## Acceptance criteria
- [ ] Student/counsellor count tracked against tier limit
- [ ] Soft block message when limit reached
- [ ] Add student/counsellor buttons disabled at limit
- [ ] Platform Admin notified when school approaches/hits limit
- [ ] 7-day grace period after expiry
- [ ] Warning banner during grace period
- [ ] Read-only mode after grace period (view only, no edits)
- [ ] Data preserved — never deleted on expiry
- [ ] Reactivation restores full access

## Blocked by
- `issues/025-stripe-integration-subscriptions.md`

## User stories addressed
- As platform admin, I want schools to be prompted to upgrade when they outgrow their tier
- As a school admin, I want clear notice when approaching limits

---
## Completion notes
**Status: COMPLETE**
- checkTierLimits utility: checks student/counsellor counts vs tier limits, subscription status, grace period
- TierLimitBanner component: 3 states (read-only, grace period with countdown, at limit)
- Read-only mode: view but no edit after grace period
- 7-day grace period handled by webhook (payment_failed → grace_period, subscription_deleted → expired)
- 4 tests
