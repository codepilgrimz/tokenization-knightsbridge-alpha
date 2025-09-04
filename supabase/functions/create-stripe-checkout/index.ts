
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { amount, orderDescription = "Token Services Payment", submissionId } = await req.json();

    if (!amount || amount <= 0) {
      throw new Error("Invalid amount provided");
    }

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not configured");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Get the origin for redirect URLs
    const origin = req.headers.get("origin") || "http://localhost:3000";

    // Create a one-time payment session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: orderDescription,
              description: "Tokenization services payment"
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/payment-success${submissionId ? `?submissionId=${submissionId}` : ''}`,
      cancel_url: `${origin}/payment-cancelled${submissionId ? `?submissionId=${submissionId}` : ''}`,
    });

    console.log(`Created Stripe checkout session: ${session.id} for amount: $${amount}`);

    return new Response(JSON.stringify({ 
      success: true,
      payment: {
        payment_url: session.url,
        session_id: session.id
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
