-- Drop existing delete policy if it exists
DROP POLICY IF EXISTS "project_delete_policy" ON projects;

-- Create new delete policy
CREATE POLICY "project_delete_policy" ON projects
FOR DELETE 
USING (created_by = auth.uid()); 