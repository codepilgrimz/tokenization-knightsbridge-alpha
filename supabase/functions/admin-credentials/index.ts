
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    const { action, email, password } = body

    if (action === 'GET' || req.method === 'GET') {
      // Get current admin credentials (without password)
      const { data, error } = await supabaseClient
        .from('admin_credentials')
        .select('id, email, created_at, updated_at')
        .single()

      if (error) {
        throw error
      }

      return new Response(
        JSON.stringify({ success: true, credentials: data }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    if (action === 'PUT' || req.method === 'PUT') {
      // Update admin credentials
      if (!email || !password) {
        return new Response(
          JSON.stringify({ success: false, error: 'Email and password are required' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        )
      }

      // Get the current record first
      const { data: currentData } = await supabaseClient
        .from('admin_credentials')
        .select('id')
        .single()

      if (!currentData) {
        return new Response(
          JSON.stringify({ success: false, error: 'No admin credentials found' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404 
          }
        )
      }

      const { data, error } = await supabaseClient
        .from('admin_credentials')
        .update({ email, password })
        .eq('id', currentData.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Admin credentials updated successfully' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    if (action === 'POST' || req.method === 'POST') {
      // Verify admin credentials for login
      const { data, error } = await supabaseClient
        .from('admin_credentials')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single()

      if (error || !data) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid credentials' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401 
          }
        )
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Login successful' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405 
      }
    )

  } catch (error) {
    console.error('Admin credentials error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
