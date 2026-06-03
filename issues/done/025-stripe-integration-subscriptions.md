## Parent PRD
`issues/prd.md`

## What to build
Stripe integration: create 4 subscription products (Starter $25/mo, Growth $55/mo, Professional $99/mo, Enterprise custom). Monthly and annual billing (20% annual discount). Payment page during school onboarding. Stripe webhooks for payment status updates (successful, failed, expired). Revenue data pulled into Platform Admin dashboard. Stripe test mode during development.

See PRD sections 7.1–7.4 (subscription and pricing).

## Acceptance criteria
- [ ] 4 tier products created in Stripe
- [ ] Monthly and annual price options (20% discount on annual)
- [ ] Payment page embedded during school onboarding flow
- [ ] Webhooks update subscription status in database
- [ ] Failed payment → school marked, admin notified
- [ ] Revenue summary visible on Platform Admin dashboard
- [ ] Test mode works with fake cards during development
- [ ] Live mode switch for production launch

## Blocked by
- `issues/001-project-scaffolding-db-schema.md`

## User stories addressed
- As platform admin, I want schools to pay automatically through Stripe
- As a school admin, I want to subscribe and manage billing easily

---
## Completion notes
**Status: COMPLETE**
- Stripe server helper with tier pricing (monthly + annual, 20% discount)
- POST /api/stripe/checkout: creates Checkout Session for subscription
- Creates Stripe customer if not exists, stores customer_id on school
- POST /api/stripe/webhook: handles checkout.session.completed, invoice.payment_succeeded, invoice.payment_failed, customer.subscription.deleted
- Payment failed → 7-day grace period
- Subscription deleted → expired status
- Uses environment variables: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
