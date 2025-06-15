-- First, disable RLS temporarily to avoid any issues during policy changes
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on projects
DROP POLICY IF EXISTS "Users can view projects they have access to" ON projects;
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can view projects they collaborate on" ON projects;
DROP POLICY IF EXISTS "project_access_policy" ON projects;
DROP POLICY IF EXISTS "basic_project_access" ON projects;

-- Create policies for all CRUD operations
CREATE POLICY "project_select_policy" ON projects
    FOR SELECT
    USING (created_by = auth.uid());

CREATE POLICY "project_insert_policy" ON projects
    FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL AND
        CASE 
            WHEN created_by IS NULL THEN true
            ELSE created_by = auth.uid()
        END
    );

CREATE POLICY "project_update_policy" ON projects
    FOR UPDATE
    USING (created_by = auth.uid())
    WITH CHECK (created_by = auth.uid());

-- Re-enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON projects TO authenticated; 