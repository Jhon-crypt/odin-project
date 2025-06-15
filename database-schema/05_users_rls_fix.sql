-- First, disable RLS temporarily to allow the policy changes
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Allow service role and auth users to insert" ON users;
DROP POLICY IF EXISTS "Allow inserts during signup" ON users;

-- Create new RLS policies for users table
CREATE POLICY "Users can view their own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only"
    ON users FOR INSERT
    WITH CHECK (
        -- Allow if the user is inserting their own record
        auth.uid() = id
    );

CREATE POLICY "Users can update their own data"
    ON users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON users TO service_role;  -- Allow service role full access
GRANT INSERT, SELECT, UPDATE ON users TO authenticated;  -- Allow authenticated users to manage their data 