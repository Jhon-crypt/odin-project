-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create invited_users table
CREATE TABLE IF NOT EXISTS invited_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    ip_address INET,
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_access_at TIMESTAMP WITH TIME ZONE,
    access_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_invited_users_email ON invited_users(email);

-- Create index on ip_address for analytics and security monitoring
CREATE INDEX IF NOT EXISTS idx_invited_users_ip ON invited_users(ip_address);

-- Enable Row Level Security (RLS)
ALTER TABLE invited_users ENABLE ROW LEVEL SECURITY;

-- Create policy to restrict read access to authenticated users
CREATE POLICY "Allow read access for authenticated users" ON invited_users
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policy to restrict insert/update to service role only
CREATE POLICY "Allow insert/update for service role only" ON invited_users
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Function to update last_access and increment access_count
CREATE OR REPLACE FUNCTION update_invited_user_access()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_access_at = CURRENT_TIMESTAMP;
    NEW.access_count = OLD.access_count + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update access tracking
CREATE TRIGGER track_invited_user_access
    BEFORE UPDATE ON invited_users
    FOR EACH ROW
    WHEN (OLD.* IS DISTINCT FROM NEW.*)
    EXECUTE FUNCTION update_invited_user_access();

-- Comments for documentation
COMMENT ON TABLE invited_users IS 'Stores information about users who have been invited to access the platform';
COMMENT ON COLUMN invited_users.email IS 'The email address of the invited user';
COMMENT ON COLUMN invited_users.ip_address IS 'The IP address from which the user last accessed the platform';
COMMENT ON COLUMN invited_users.invited_at IS 'Timestamp when the user was initially invited';
COMMENT ON COLUMN invited_users.last_access_at IS 'Timestamp of the users last access';
COMMENT ON COLUMN invited_users.access_count IS 'Number of times the user has accessed the platform';
COMMENT ON COLUMN invited_users.is_active IS 'Whether the invitation is still active'; 