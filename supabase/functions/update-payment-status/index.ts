import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { submissionId, status } = await req.json()

    if (!submissionId || !status) {
      throw new Error('Missing submissionId or status')
    }

    // Validate status
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled', 'expired']
    if (!validStatuses.includes(status.toLowerCase())) {
      throw new Error('Invalid status')
    }

    const { data, error } = await supabaseClient
      .from('form_submissions')
      .update({ 
        payment_status: status.toLowerCase(),
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId)
      .select()

    if (error) {
      console.error('Error updating payment status:', error)
      throw error
    }

    console.log(`Updated payment status to ${status} for submission ${submissionId}`)

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Update payment status error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})