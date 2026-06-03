import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) return NextResponse.json({ error: "No signature" }, { status: 400 });

  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook verification failed: ${err.message}` }, { status: 400 });
  }

  const supabase = await createClient();
  const s = supabase as any;

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;
      const schoolId = session.metadata?.school_id;
      const tier = session.metadata?.tier;
      if (schoolId && tier) {
        await s.from("schools").update({
          stripe_subscription_id: session.subscription,
          subscription_tier: tier,
          subscription_status: "active",
        }).eq("id", schoolId);
      }
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as any;
      const customerId = invoice.customer;
      if (customerId) {
        const { data: school } = await s.from("schools").select("id").eq("stripe_customer_id", customerId).single();
        if (school) {
          await s.from("schools").update({ subscription_status: "active", grace_period_ends_at: null }).eq("id", school.id);
        }
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as any;
      const customerId = invoice.customer;
      if (customerId) {
        const { data: school } = await s.from("schools").select("id").eq("stripe_customer_id", customerId).single();
        if (school) {
          const graceEnd = new Date();
          graceEnd.setDate(graceEnd.getDate() + 7);
          await s.from("schools").update({ subscription_status: "grace_period", grace_period_ends_at: graceEnd.toISOString() }).eq("id", school.id);
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as any;
      const customerId = sub.customer;
      if (customerId) {
        const { data: school } = await s.from("schools").select("id").eq("stripe_customer_id", customerId).single();
        if (school) {
          await s.from("schools").update({ subscription_status: "expired" }).eq("id", school.id);
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
