-- Drop existing users RLS policy
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Allow service role and auth users to insert" ON users;

-- Create new RLS policies for users table
CREATE POLICY "Users can view their own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Allow inserts during signup"
    ON users FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own data"
    ON users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Grant necessary permissions
GRANT INSERT ON users TO anon;
GRANT INSERT ON users TO authenticated;
GRANT SELECT ON users TO authenticated;
GRANT UPDATE ON users TO authenticated; 