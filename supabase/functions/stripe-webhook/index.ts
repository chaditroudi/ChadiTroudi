import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Stripe signature verification using Web Crypto API
async function verifyStripeSignature(
  payload: string,
  sigHeader: string,
  secret: string
): Promise<boolean> {
  const parts = sigHeader.split(",").reduce(
    (acc, part) => {
      const [key, val] = part.split("=");
      if (key === "t") acc.timestamp = val;
      if (key === "v1") acc.signatures.push(val);
      return acc;
    },
    { timestamp: "", signatures: [] as string[] }
  );

  const signedPayload = `${parts.timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(signedPayload)
  );
  const expectedSig = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return parts.signatures.some((s) => s === expectedSig);
}

// Plan token allocations (should match plan_limits table)
const PLAN_TOKENS: Record<string, number> = {
  starter: 200,
  pro: 1000,
  bootcamp: 2000,
};

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new Response("Missing signature", { status: 400 });
  }

  const valid = await verifyStripeSignature(body, sig, STRIPE_WEBHOOK_SECRET);
  if (!valid) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  switch (event.type) {
    // ─── Subscription created or renewed ───
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      const type = session.metadata?.type;

      if (!userId) break;

      if (type === "subscription") {
        const plan = session.metadata.plan;
        const tokens = PLAN_TOKENS[plan] || 200;

        await supabase
          .from("student_profiles")
          .update({
            subscription_plan: plan,
            subscription_status: "active",
            subscription_started_at: new Date().toISOString(),
            subscription_ends_at: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            ai_tokens: tokens,
            stripe_subscription_id: session.subscription,
          })
          .eq("user_id", userId);

        // Record token grant
        await supabase.from("token_transactions").insert({
          user_id: userId,
          amount: tokens,
          balance_after: tokens,
          type: "grant",
          source: "subscription",
          description: `${plan} plan activated — ${tokens} tokens`,
        });
      } else if (type === "tokens") {
        const tokenAmount = parseInt(session.metadata.token_amount, 10);

        // Get current balance
        const { data: profile } = await supabase
          .from("student_profiles")
          .select("ai_tokens, lifetime_tokens_purchased")
          .eq("user_id", userId)
          .maybeSingle();

        const currentTokens = profile?.ai_tokens || 0;
        const currentPurchased = profile?.lifetime_tokens_purchased || 0;
        const newBalance = currentTokens + tokenAmount;

        await supabase
          .from("student_profiles")
          .update({
            ai_tokens: newBalance,
            lifetime_tokens_purchased: currentPurchased + tokenAmount,
          })
          .eq("user_id", userId);

        await supabase.from("token_transactions").insert({
          user_id: userId,
          amount: tokenAmount,
          balance_after: newBalance,
          type: "purchase",
          source: "token_store",
          description: `Purchased ${tokenAmount} tokens`,
        });
      }
      break;
    }

    // ─── Subscription renewed (recurring payment) ───
    case "invoice.payment_succeeded": {
      const invoice = event.data.object;
      if (invoice.billing_reason !== "subscription_cycle") break;

      const subId = invoice.subscription;

      // Fetch subscription to get metadata
      const subRes = await fetch(
        `https://api.stripe.com/v1/subscriptions/${subId}`,
        {
          headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` },
        }
      );
      const subscription = await subRes.json();
      const userId = subscription.metadata?.user_id;
      const plan = subscription.metadata?.plan;

      if (!userId || !plan) break;

      const tokens = PLAN_TOKENS[plan] || 200;

      // Get current balance to add monthly tokens
      const { data: profile } = await supabase
        .from("student_profiles")
        .select("ai_tokens")
        .eq("user_id", userId)
        .maybeSingle();

      const newBalance = (profile?.ai_tokens || 0) + tokens;

      await supabase
        .from("student_profiles")
        .update({
          ai_tokens: newBalance,
          subscription_ends_at: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        })
        .eq("user_id", userId);

      await supabase.from("token_transactions").insert({
        user_id: userId,
        amount: tokens,
        balance_after: newBalance,
        type: "grant",
        source: "subscription_renewal",
        description: `Monthly ${plan} plan renewal — ${tokens} tokens`,
      });
      break;
    }

    // ─── Subscription cancelled ───
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const userId = subscription.metadata?.user_id;

      if (!userId) break;

      await supabase
        .from("student_profiles")
        .update({
          subscription_plan: "free",
          subscription_status: "cancelled",
        })
        .eq("user_id", userId);
      break;
    }

    // ─── Payment failed ───
    case "invoice.payment_failed": {
      const invoice = event.data.object;
      const subId = invoice.subscription;

      const subRes = await fetch(
        `https://api.stripe.com/v1/subscriptions/${subId}`,
        {
          headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` },
        }
      );
      const subscription = await subRes.json();
      const userId = subscription.metadata?.user_id;

      if (!userId) break;

      await supabase
        .from("student_profiles")
        .update({ subscription_status: "past_due" })
        .eq("user_id", userId);
      break;
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
