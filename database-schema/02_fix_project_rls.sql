-- First, disable RLS temporarily to avoid any issues during policy changes
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on projects
DROP POLICY IF EXISTS "Users can view projects they have access to" ON projects;
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can view projects they collaborate on" ON projects;
DROP POLICY IF EXISTS "project_access_policy" ON projects;

-- Create a single, simple policy for all operations
CREATE POLICY "project_access_policy" ON projects
    FOR ALL
    USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 
            FROM project_collaborators pc 
            WHERE pc.project_id = projects.id 
            AND pc.user_id = auth.uid()
        )
    );

-- Re-enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY; 