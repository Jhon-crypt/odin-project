-- Completely disable RLS first
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Users can view projects they have access to" ON projects;
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can view projects they collaborate on" ON projects;
DROP POLICY IF EXISTS "project_access_policy" ON projects;

-- Create the most basic policy possible - just allow users to see their own projects
CREATE POLICY "basic_project_access" ON projects
    FOR ALL
    USING (created_by = auth.uid());

-- Re-enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON projects TO authenticated; 