-- Disable RLS for users table since security is handled by Supabase Auth
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Allow service role and auth users to insert" ON users;
DROP POLICY IF EXISTS "Allow inserts during signup" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;

-- Grant necessary permissions
GRANT ALL ON users TO service_role;  -- Allow service role full access
GRANT ALL ON users TO authenticated;  -- Allow authenticated users full access
GRANT ALL ON users TO anon;  -- Allow anonymous access for signup 