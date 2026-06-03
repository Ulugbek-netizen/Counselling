## Parent PRD
`issues/prd.md`

## What to build
Pricing section on the landing page. Tier cards: Starter ($25/mo, 50 students, 3 counsellors), Growth ($55/mo, 150 students, 8 counsellors), Professional ($99/mo, 350 students, 15 counsellors), Enterprise (custom, unlimited). Monthly/annual toggle with 20% annual discount. All tiers show "All features included." "Get started" button per tier → links to onboarding. "Book a demo" for Enterprise.

See PRD section 7.1 (tiers).

## Acceptance criteria
- [ ] 4 tier cards with correct pricing
- [ ] Monthly/annual toggle updates all prices
- [ ] Annual prices show 20% savings
- [ ] "All features included" on every tier
- [ ] "Get started" buttons link to sign-up/payment flow
- [ ] Enterprise card shows "Contact us" instead of price
- [ ] Responsive layout
- [ ] Integrated into existing landing page

## Blocked by
- `issues/025-stripe-integration-subscriptions.md`

## User stories addressed
- As a school admin, I want to see clear pricing before deciding to subscribe

---
## Completion notes
**Status: COMPLETE**
- PricingSection component with 4 tier cards
- Monthly/annual toggle (20% annual savings shown)
- "Most popular" badge on Growth tier
- Per-tier: price, students, counsellors, "All features included"
- Enterprise shows "Custom" + "Contact us"
- "Every plan includes" feature grid (9 items)
- Integrated into landing page before CTA section
