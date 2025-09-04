
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  console.log('Request method:', req.method)
  console.log('Request headers:', Object.fromEntries(req.headers.entries()))

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response(null, {
      headers: corsHeaders,
      status: 200
    })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405
      }
    )
  }

  try {
    console.log('Creating Supabase client')
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    console.log('Parsing request body')
    const requestBody = await req.text()
    console.log('Request body:', requestBody)

    const { formData } = JSON.parse(requestBody)
    console.log('Parsed form data:', JSON.stringify(formData, null, 2))

    // Insert main form submission
    console.log('Inserting main form submission')
    const { data: submission, error: submissionError } = await supabaseClient
      .from('form_submissions')
      .insert(formData.main)
      .select()
      .single()

    if (submissionError) {
      console.error('Submission error:', submissionError)
      throw submissionError
    }

    const submissionId = submission.id
    console.log('Created submission with ID:', submissionId)

    // Insert uploaded documents metadata
    if (formData.uploadedDocuments && Object.keys(formData.uploadedDocuments).length > 0) {
      console.log('Inserting uploaded documents metadata:', formData.uploadedDocuments)
      const documentsToInsert = Object.entries(formData.uploadedDocuments).map(([fieldName, fileData]: [string, any]) => ({
        submission_id: submissionId,
        field_name: fieldName,
        original_filename: fileData.originalFilename || fileData.file?.name || 'unknown',
        file_path: fileData.filePath || fileData.storagePath || '',
        file_size: fileData.fileSize || fileData.file?.size || 0,
        mime_type: fileData.mimeType || fileData.file?.type || 'application/octet-stream'
      }))

      console.log('Documents to insert:', documentsToInsert)

      const { error: documentsError } = await supabaseClient
        .from('uploaded_documents')
        .insert(documentsToInsert)

      if (documentsError) {
        console.error('Documents metadata error:', documentsError)
        // Don't throw error for documents metadata, just log it
      } else {
        console.log('Successfully inserted documents metadata')
      }
    }

    // Insert related data
    if (formData.tokenFeatures && formData.tokenFeatures.length > 0) {
      console.log('Inserting token features')
      const tokenFeatures = formData.tokenFeatures.map((feature: string) => ({
        submission_id: submissionId,
        feature_name: feature
      }))

      const { error: featuresError } = await supabaseClient
        .from('token_features')
        .insert(tokenFeatures)

      if (featuresError) {
        console.error('Features error:', featuresError)
        throw featuresError
      }
    }

    if (formData.raiseDocumentRegions && formData.raiseDocumentRegions.length > 0) {
      console.log('Inserting raise document regions')
      const regions = formData.raiseDocumentRegions.map((region: string) => ({
        submission_id: submissionId,
        region: region
      }))

      const { error: regionsError } = await supabaseClient
        .from('raise_document_regions')
        .insert(regions)

      if (regionsError) {
        console.error('Regions error:', regionsError)
        throw regionsError
      }
    }

    if (formData.exchangeListings && formData.exchangeListings.length > 0) {
      console.log('Inserting exchange listings')
      const exchanges = formData.exchangeListings.map((exchange: string) => ({
        submission_id: submissionId,
        exchange_name: exchange
      }))

      const { error: exchangesError } = await supabaseClient
        .from('exchange_listings')
        .insert(exchanges)

      if (exchangesError) {
        console.error('Exchanges error:', exchangesError)
        throw exchangesError
      }
    }

    if (formData.legalDocuments && formData.legalDocuments.length > 0) {
      console.log('Inserting legal documents')
      const documents = formData.legalDocuments.map((doc: string) => ({
        submission_id: submissionId,
        document_type: doc
      }))

      const { error: documentsError } = await supabaseClient
        .from('legal_documents')
        .insert(documents)

      if (documentsError) {
        console.error('Documents error:', documentsError)
        throw documentsError
      }
    }

    console.log('Form submission completed successfully')
    return new Response(
      JSON.stringify({ success: true, submissionId }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
