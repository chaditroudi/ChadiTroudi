import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const APP_URL = Deno.env.get("APP_URL") || "https://chaditroudi.com";

// Map plans/token packs to Stripe Price IDs (configure in Stripe Dashboard)
const PLAN_PRICE_IDS: Record<string, string> = {
  starter: Deno.env.get("STRIPE_PRICE_STARTER") || "",
  pro: Deno.env.get("STRIPE_PRICE_PRO") || "",
  bootcamp: Deno.env.get("STRIPE_PRICE_BOOTCAMP") || "",
};

const TOKEN_PRICE_IDS: Record<number, string> = {
  100: Deno.env.get("STRIPE_PRICE_TOKENS_100") || "",
  500: Deno.env.get("STRIPE_PRICE_TOKENS_500") || "",
  1500: Deno.env.get("STRIPE_PRICE_TOKENS_1500") || "",
  5000: Deno.env.get("STRIPE_PRICE_TOKENS_5000") || "",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Authenticate user from JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { type, plan, tokenAmount } = await req.json();

    let priceId: string;
    let mode: "subscription" | "payment";
    let metadata: Record<string, string>;

    if (type === "subscription" && plan) {
      priceId = PLAN_PRICE_IDS[plan];
      mode = "subscription";
      metadata = { user_id: user.id, type: "subscription", plan };
    } else if (type === "tokens" && tokenAmount) {
      priceId = TOKEN_PRICE_IDS[tokenAmount];
      mode = "payment";
      metadata = {
        user_id: user.id,
        type: "tokens",
        token_amount: String(tokenAmount),
      };
    } else {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!priceId) {
      return new Response(
        JSON.stringify({ error: "Price not configured for this product" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Look up or create Stripe customer
    const { data: profile } = await supabase
      .from("student_profiles")
      .select("stripe_customer_id, display_name")
      .eq("user_id", user.id)
      .maybeSingle();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      // Create Stripe customer
      const customerRes = await fetch("https://api.stripe.com/v1/customers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: user.email || "",
          name: profile?.display_name || "",
          "metadata[supabase_user_id]": user.id,
        }),
      });
      const customer = await customerRes.json();
      customerId = customer.id;

      // Save stripe_customer_id
      await supabase
        .from("student_profiles")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", user.id);
    }

    // Create Stripe Checkout Session
    const params = new URLSearchParams({
      "mode": mode,
      "customer": customerId!,
      "success_url": `${APP_URL}/#/platform/billing?session_id={CHECKOUT_SESSION_ID}&status=success`,
      "cancel_url": `${APP_URL}/#/platform/billing?status=cancelled`,
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      "metadata[user_id]": user.id,
      "metadata[type]": type,
    });

    if (type === "subscription") {
      params.set("metadata[plan]", plan);
    } else {
      params.set("metadata[token_amount]", String(tokenAmount));
    }

    const sessionRes = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      }
    );

    const session = await sessionRes.json();

    if (session.error) {
      return new Response(JSON.stringify({ error: session.error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
