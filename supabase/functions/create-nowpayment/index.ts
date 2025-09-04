
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('NOWPayments function called')

    const { amount, currency, orderId, orderDescription, submissionId } = await req.json()
    console.log('Request data:', { amount, currency, orderId, orderDescription })

    const nowPaymentsApiKey = Deno.env.get('NOWPAYMENTS_API_KEY')
    console.log('API key exists:', !!nowPaymentsApiKey)

    if (!nowPaymentsApiKey) {
      console.error('NOWPayments API key not found in environment')
      throw new Error('NOWPayments API key not configured')
    }

    // Get the origin for callback URLs
    const origin = req.headers.get('origin') || req.headers.get('referer')?.replace(/\/$/, '') || 'https://tokenization-knightsbridge.vercel.app'
    console.log('Origin for callbacks:', origin)

    const requestBody = {
      price_amount: amount,
      price_currency: 'USD',
      pay_currency: currency, // BTC or USDTTRC20
      order_id: orderId,
      order_description: orderDescription,
      success_url: `${origin}/payment-success${submissionId ? `?submissionId=${submissionId}` : ''}`,
      cancel_url: `${origin}/payment-cancelled${submissionId ? `?submissionId=${submissionId}` : ''}`,
    }

    console.log('Making request to NOWPayments with:', requestBody)

    // Create payment with NOWPayments using the invoice API
    const paymentResponse = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': nowPaymentsApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    console.log('NOWPayments response status:', paymentResponse.status)

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.text()
      console.error('NOWPayments API error:', errorData)
      return new Response(
        JSON.stringify({
          success: false,
          error: `NOWPayments API error: ${paymentResponse.status} - ${errorData}`
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const paymentData = await paymentResponse.json()
    console.log('NOWPayments success:', paymentData)

    // Check if we have an invoice_url (for invoice API) or payment_url
    const redirectUrl = paymentData.invoice_url || paymentData.payment_url
    
    if (!redirectUrl) {
      console.error('No payment URL received from NOWPayments:', paymentData)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No payment URL received from NOWPayments'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log('Payment URL to redirect to:', redirectUrl)

    return new Response(
      JSON.stringify({
        success: true,
        payment: {
          ...paymentData,
          payment_url: redirectUrl
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error creating NOWPayment:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
