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

    // Calculate date 7 days ago
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    // Find submissions that are pending or processing and older than 7 days
    const { data: expiredSubmissions, error: fetchError } = await supabaseClient
      .from('form_submissions')
      .select('id, created_at, payment_status')
      .in('payment_status', ['pending', 'processing'])
      .lt('created_at', weekAgo.toISOString())

    if (fetchError) {
      console.error('Error fetching expired submissions:', fetchError)
      throw fetchError
    }

    if (!expiredSubmissions || expiredSubmissions.length === 0) {
      console.log('No expired payments found')
      return new Response(
        JSON.stringify({ success: true, updatedCount: 0 }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Update all expired submissions
    const expiredIds = expiredSubmissions.map(sub => sub.id)
    
    const { data, error: updateError } = await supabaseClient
      .from('form_submissions')
      .update({ 
        payment_status: 'expired',
        updated_at: new Date().toISOString()
      })
      .in('id', expiredIds)
      .select()

    if (updateError) {
      console.error('Error updating expired submissions:', updateError)
      throw updateError
    }

    console.log(`Updated ${expiredIds.length} expired payments`)

    return new Response(
      JSON.stringify({ success: true, updatedCount: expiredIds.length }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Check expired payments error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})