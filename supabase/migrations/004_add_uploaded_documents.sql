
-- Create uploaded_documents table to store file metadata
CREATE TABLE uploaded_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES form_submissions(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_uploaded_documents_submission_id ON uploaded_documents(submission_id);
CREATE INDEX idx_uploaded_documents_field_name ON uploaded_documents(field_name);
