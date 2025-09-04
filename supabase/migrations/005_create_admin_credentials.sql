
-- Create admin_credentials table
CREATE TABLE admin_credentials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert initial admin credentials
INSERT INTO admin_credentials (email, password) VALUES ('admin@knightsbridge.com', 'Adminpass123!@#');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admin_credentials_updated_at BEFORE UPDATE
    ON admin_credentials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all operations for now, you can restrict later)
CREATE POLICY "Enable all operations for admin_credentials" ON admin_credentials
    FOR ALL USING (true);
