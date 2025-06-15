-- First, disable RLS temporarily to avoid any issues during policy changes
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on projects
DROP POLICY IF EXISTS "Users can view projects they have access to" ON projects;
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can view projects they collaborate on" ON projects;

-- Create a single, simple policy
CREATE POLICY "project_access_policy" ON projects
    FOR ALL
    USING (
        created_by = auth.uid() OR
        id IN (
            SELECT project_id 
            FROM project_collaborators 
            WHERE user_id = auth.uid()
        )
    );

-- Re-enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY; 