
-- Create contact_messages table
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on contact_messages table
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to allow all operations
CREATE POLICY "Allow all operations on contact_messages" ON contact_messages FOR ALL USING (true);

-- Create index for better performance
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX idx_contact_messages_email ON contact_messages(email);
