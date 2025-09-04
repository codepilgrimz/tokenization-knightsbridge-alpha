
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Fetch all submissions with related data (excluding uploaded_documents for now)
    const { data: submissions, error: submissionsError } = await supabaseClient
      .from('form_submissions')
      .select(`
        *,
        token_features(feature_name),
        raise_document_regions(region),
        exchange_listings(exchange_name),
        legal_documents(document_type),
        letterhead_services(enabled, guidelines),
        raise_documents(company, contact_name, contact_person, position, email, phone, address, website),
        whitepapers(pages, guidelines),
        website_plans(enabled, guidelines),
        legal_document_preferences(preferences),
        exchange_listings_preferences(preferences)
      `)
      .order('created_at', { ascending: false });

    if (submissionsError) {
      throw submissionsError;
    }

    // Fetch all uploaded documents separately
    const { data: uploadedDocuments, error: documentsError } = await supabaseClient
      .from('uploaded_documents')
      .select('*');

    if (documentsError) {
      console.error('Error fetching uploaded documents:', documentsError);
      // Don't throw error, just log it and continue without documents
    }

    console.log('Fetched submissions:', submissions?.length);
    console.log('Fetched documents:', uploadedDocuments?.length);

    // Group uploaded documents by submission_id
    const documentsBySubmission = {};
    if (uploadedDocuments) {
      uploadedDocuments.forEach(doc => {
        if (!documentsBySubmission[doc.submission_id]) {
          documentsBySubmission[doc.submission_id] = [];
        }
        documentsBySubmission[doc.submission_id].push(doc);
      });
    }

    // Transform the data to match the frontend interface
    const transformedSubmissions = submissions?.map((submission) => ({
      id: submission.id,
      type: submission.type,
      submissionDate: submission.submission_date?.split('T')[0] || '',
      contactEmail: submission.contact_email,
      contactPhone: submission.contact_phone,
      
      // KYC fields
      kycFullName: submission.kyc_full_name,
      kycIdNumber: submission.kyc_id_number,
      kycDateOfBirth: submission.kyc_date_of_birth,
      kycNationality: submission.kyc_nationality,
      kycAddress: submission.kyc_address,
      kycOccupation: submission.kyc_occupation,
      kycEmployer: submission.kyc_employer,
      kycIncomeSource: submission.kyc_income_source,
      kycNetWorth: submission.kyc_net_worth,
      kycInvestmentExperience: submission.kyc_investment_experience,
      kycRiskTolerance: submission.kyc_risk_tolerance,
      kycInvestmentObjectives: submission.kyc_investment_objectives,
      
      // Custodian fields
      custodianName: submission.custodian_name,
      custodianContact: submission.custodian_contact,
      custodianRegistration: submission.custodian_registration,
      custodianAddress: submission.custodian_address,
      custodianServices: submission.custodian_services,
      
      // Issuer fields
      issuerEntityName: submission.issuer_entity_name,
      issuerJurisdiction: submission.issuer_jurisdiction,
      issuerContactPerson: submission.issuer_contact_person,
      issuerContactInfo: submission.issuer_contact_info,
      issuerAddress: submission.issuer_address,
      issuerBusinessType: submission.issuer_business_type,
      issuerRegistrationNumber: submission.issuer_registration_number,
      
      // Business plan fields
      businessPlanType: submission.business_plan_type,
      businessPlanGuidelines: submission.business_plan_guidelines,
      businessPlanExecutiveSummary: submission.business_plan_executive_summary,
      businessPlanMarketAnalysis: submission.business_plan_market_analysis,
      businessPlanFinancialProjections: submission.business_plan_financial_projections,
      
      // Savings plan fields
      savingsPlanGuidelines: submission.savings_plan_guidelines,
      
      // Pension plan fields
      pensionPlanGuidelines: submission.pension_plan_guidelines,
      
      // Token fields
      tokenName: submission.token_name,
      tokenTicker: submission.token_ticker,
      tokenChain: submission.token_chain,
      tokenDecimals: submission.token_decimals,
      targetPrice: submission.target_price,
      treasuryAddress: submission.treasury_address,
      isStablecoin: submission.is_stablecoin,
      
      // Features and services
      wantMoreFeatures: submission.token_features?.map((f) => f.feature_name) || [],
      features: submission.token_features?.map((f) => f.feature_name) || [],
      featuresEnabled: submission.token_features && submission.token_features.length > 0,
      featuresGuidelines: submission.features_guidelines,
      
      // Letterhead service
      letterheadEnabled: submission.letterhead_services?.[0]?.enabled || false,
      letterheadGuidelines: submission.letterhead_services?.[0]?.guidelines,
      
      // Raise document fields
      raiseDocumentEnabled: submission.raise_documents && submission.raise_documents.length > 0,
      raiseDocumentRegions: submission.raise_document_regions?.map((r) => r.region) || [],
      raiseDocumentCompany: submission.raise_documents?.[0]?.company,
      raiseDocumentContactName: submission.raise_documents?.[0]?.contact_name,
      raiseDocumentContactPerson: submission.raise_documents?.[0]?.contact_person,
      raiseDocumentPosition: submission.raise_documents?.[0]?.position,
      raiseDocumentEmail: submission.raise_documents?.[0]?.email,
      raiseDocumentPhone: submission.raise_documents?.[0]?.phone,
      raiseDocumentAddress: submission.raise_documents?.[0]?.address,
      raiseDocumentWebsite: submission.raise_documents?.[0]?.website,
      
      // Whitepaper fields
      whitePaperEnabled: submission.whitepapers && submission.whitepapers.length > 0,
      whitePaperPages: submission.whitepapers?.[0]?.pages,
      whitePaperGuidelines: submission.whitepapers?.[0]?.guidelines,
      
      // Website plan fields
      websitePlanEnabled: submission.website_plans?.[0]?.enabled || false,
      websitePlanGuidelines: submission.website_plans?.[0]?.guidelines,
      
      // Exchange listings
      exchangeListings: submission.exchange_listings?.map((e) => e.exchange_name) || [],
      exchangeListingsPreferences: submission.exchange_listings_preferences?.[0]?.preferences,
      
      // Legal documents
      legalDocumentsEnabled: submission.legal_documents && submission.legal_documents.length > 0,
      legalDocuments: submission.legal_documents?.map((d) => d.document_type) || [],
      legalDocumentsPreferences: submission.legal_document_preferences?.[0]?.preferences,
      
      // Payment and status
      paymentAmount: submission.payment_amount || 0,
      status: submission.status || 'Pending',
      
      // Add uploaded documents from the separate query
      uploadedDocuments: (documentsBySubmission[submission.id] || []).map((doc) => ({
        id: doc.id,
        fieldName: doc.field_name,
        originalFilename: doc.original_filename,
        filePath: doc.file_path,
        fileSize: doc.file_size,
        mimeType: doc.mime_type
      }))
    })) || [];

    console.log('Transformed submissions:', transformedSubmissions.length);

    return new Response(
      JSON.stringify({
        submissions: transformedSubmissions
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    );
  }
});
