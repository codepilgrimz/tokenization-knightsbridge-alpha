
-- Consolidated database schema for form submissions
-- This file creates the complete database structure from scratch

-- Create main form_submissions table
CREATE TABLE form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('Knightsbridge', 'Decentralized')),
  submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contact Information (both types)
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  
  -- KYC Information (Knightsbridge only)
  kyc_full_name TEXT,
  kyc_id_number TEXT,
  kyc_date_of_birth DATE,
  kyc_nationality TEXT,
  kyc_address TEXT,
  kyc_occupation TEXT,
  kyc_employer TEXT,
  kyc_income_source TEXT,
  
  -- Custodian Information (Knightsbridge only)
  custodian_name TEXT,
  custodian_contact TEXT,
  custodian_registration TEXT,
  custodian_address TEXT,
  custodian_services TEXT,
  
  -- Issuer Information (Knightsbridge only)
  issuer_entity_name TEXT,
  issuer_jurisdiction TEXT,
  issuer_contact_person TEXT,
  issuer_contact_info TEXT,
  issuer_address TEXT,
  issuer_business_type TEXT,
  issuer_registration_number TEXT,
  
  -- Business Plan (Knightsbridge only)
  business_plan_type TEXT,
  business_plan_guidelines TEXT,
  business_plan_executive_summary TEXT,
  business_plan_market_analysis TEXT,
  business_plan_financial_projections TEXT,

  -- Savings Plans (Knightsbridge only)
  savings_plan_guidelines TEXT,

  -- Pension Plans (Knightsbridge only)
  pension_plan_guidelines TEXT,

  -- Token Information (both types)
  token_name TEXT,
  token_ticker TEXT,
  token_chain TEXT,
  token_decimals TEXT,
  target_price TEXT,
  treasury_address TEXT,
  is_stablecoin BOOLEAN DEFAULT false,
  
  -- Payment Information
  payment_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Completed')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create token_features table for many-to-many relationship
CREATE TABLE token_features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES form_submissions(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create raise_document_regions table
CREATE TABLE raise_document_regions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES form_submissions(id) ON DELETE CASCADE,
  region TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exchange_listings table
CREATE TABLE exchange_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES form_submissions(id) ON DELETE CASCADE,
  exchange_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create legal_documents table
CREATE TABLE legal_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES form_submissions(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create letterhead_services table
CREATE TABLE letterhead_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES form_submissions(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT false,
  guidelines TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create raise_documents table (for detailed info)
CREATE TABLE raise_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES form_submissions(id) ON DELETE CASCADE,
  company TEXT,
  contact_name TEXT,
  contact_person TEXT,
  position TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create whitepapers table
CREATE TABLE whitepapers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES form_submissions(id) ON DELETE CASCADE,
  pages TEXT,
  guidelines TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create website_plans table
CREATE TABLE website_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES form_submissions(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT false,
  guidelines TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create legal_document_preferences table
CREATE TABLE legal_document_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES form_submissions(id) ON DELETE CASCADE,
  preferences TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exchange_listings_preferences table
CREATE TABLE exchange_listings_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES form_submissions(id) ON DELETE CASCADE,
  preferences TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE raise_document_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE letterhead_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE raise_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE whitepapers ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_document_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_listings_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all operations for now)
CREATE POLICY "Allow all operations on form_submissions" ON form_submissions FOR ALL USING (true);
CREATE POLICY "Allow all operations on token_features" ON token_features FOR ALL USING (true);
CREATE POLICY "Allow all operations on raise_document_regions" ON raise_document_regions FOR ALL USING (true);
CREATE POLICY "Allow all operations on exchange_listings" ON exchange_listings FOR ALL USING (true);
CREATE POLICY "Allow all operations on legal_documents" ON legal_documents FOR ALL USING (true);
CREATE POLICY "Allow all operations on letterhead_services" ON letterhead_services FOR ALL USING (true);
CREATE POLICY "Allow all operations on raise_documents" ON raise_documents FOR ALL USING (true);
CREATE POLICY "Allow all operations on whitepapers" ON whitepapers FOR ALL USING (true);
CREATE POLICY "Allow all operations on website_plans" ON website_plans FOR ALL USING (true);
CREATE POLICY "Allow all operations on legal_document_preferences" ON legal_document_preferences FOR ALL USING (true);
CREATE POLICY "Allow all operations on exchange_listings_preferences" ON exchange_listings_preferences FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_form_submissions_type ON form_submissions(type);
CREATE INDEX idx_form_submissions_status ON form_submissions(status);
CREATE INDEX idx_form_submissions_created_at ON form_submissions(created_at);
CREATE INDEX idx_token_features_submission_id ON token_features(submission_id);
CREATE INDEX idx_raise_document_regions_submission_id ON raise_document_regions(submission_id);
CREATE INDEX idx_exchange_listings_submission_id ON exchange_listings(submission_id);
CREATE INDEX idx_legal_documents_submission_id ON legal_documents(submission_id);
CREATE INDEX idx_letterhead_services_submission_id ON letterhead_services(submission_id);
CREATE INDEX idx_raise_documents_submission_id ON raise_documents(submission_id);
CREATE INDEX idx_whitepapers_submission_id ON whitepapers(submission_id);
CREATE INDEX idx_website_plans_submission_id ON website_plans(submission_id);
CREATE INDEX idx_legal_document_preferences_submission_id ON legal_document_preferences(submission_id);
CREATE INDEX idx_exchange_listings_preferences_submission_id ON exchange_listings_preferences(submission_id);
