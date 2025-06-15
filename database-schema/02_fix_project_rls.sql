-- Drop existing policy
DROP POLICY IF EXISTS "Users can view projects they have access to" ON projects;

-- Create separate policies for owners and collaborators
CREATE POLICY "Users can view their own projects"
    ON projects FOR SELECT
    USING (auth.uid() = created_by);

CREATE POLICY "Users can view projects they collaborate on"
    ON projects FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM project_collaborators 
            WHERE project_collaborators.project_id = id 
            AND project_collaborators.user_id = auth.uid()
        )
    ); 