import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set in environment");
  return new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
}

export const TIER_PRICES: Record<string, { monthly: number; annual: number; students: number; counsellors: number }> = {
  starter:      { monthly: 2500, annual: 24000, students: 50,   counsellors: 3 },
  growth:       { monthly: 5500, annual: 52800, students: 150,  counsellors: 8 },
  professional: { monthly: 9900, annual: 95000, students: 350,  counsellors: 15 },
  enterprise:   { monthly: 0,    annual: 0,     students: 9999, counsellors: 999 },
};
