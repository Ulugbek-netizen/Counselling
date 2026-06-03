import { createClient } from "@/lib/supabase/server";
import { getStripe, TIER_PRICES } from "@/lib/stripe/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await (supabase as any).from("profiles").select("role, school_id").eq("id", user.id).single();
  if (!profile || !["school_admin", "platform_admin"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { tier, billing, schoolId } = body as { tier: string; billing: "monthly" | "annual"; schoolId: string };

  const prices = TIER_PRICES[tier];
  if (!prices || tier === "enterprise") {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  const stripe = getStripe();
  const amount = billing === "annual" ? prices.annual : prices.monthly;
  const interval = billing === "annual" ? "year" : "month";

  try {
    // Create or get Stripe customer
    const { data: school } = await (supabase as any).from("schools").select("stripe_customer_id, name").eq("id", schoolId).single();

    let customerId = school?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        name: school?.name ?? "School",
        metadata: { school_id: schoolId },
      });
      customerId = customer.id;
      await (supabase as any).from("schools").update({ stripe_customer_id: customerId }).eq("id", schoolId);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: `EduPath ${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan` },
          unit_amount: amount,
          recurring: { interval },
        },
        quantity: 1,
      }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/admin/schools?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/admin/schools?payment=cancelled`,
      metadata: { school_id: schoolId, tier, billing },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
