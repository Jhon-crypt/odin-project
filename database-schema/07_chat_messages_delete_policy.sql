-- Drop existing delete policy if it exists
DROP POLICY IF EXISTS "Users can delete messages in their projects" ON chat_messages;

-- Create new delete policy
CREATE POLICY "Users can delete messages in their projects"
ON chat_messages 
FOR DELETE 
USING (
    user_id = auth.uid() -- User can delete their own messages
    OR (
        EXISTS ( -- Project owner can delete any message
            SELECT 1 FROM projects p
            WHERE p.id = chat_messages.project_id
            AND p.created_by = auth.uid()
        )
    )
); 