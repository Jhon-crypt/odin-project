-- Create chat_messages table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create canvas_items table
CREATE TABLE canvas_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('text', 'image', 'link', 'file', 'note')),
    content JSONB NOT NULL,
    position JSONB NOT NULL DEFAULT '{"x": 0, "y": 0}'::jsonb,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add indexes for better query performance
CREATE INDEX idx_chat_messages_project_id ON chat_messages(project_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_canvas_items_project_id ON canvas_items(project_id);
CREATE INDEX idx_canvas_items_created_by ON canvas_items(created_by);

-- RLS Policies for chat_messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their projects" ON chat_messages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = chat_messages.project_id
            AND (
                p.created_by = auth.uid() 
                OR 
                EXISTS (
                    SELECT 1 FROM project_collaborators pc 
                    WHERE pc.project_id = p.id 
                    AND pc.user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Users can create messages in their projects" ON chat_messages
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = chat_messages.project_id
            AND (
                p.created_by = auth.uid() 
                OR 
                EXISTS (
                    SELECT 1 FROM project_collaborators pc 
                    WHERE pc.project_id = p.id 
                    AND pc.user_id = auth.uid()
                )
            )
        )
    );

-- RLS Policies for canvas_items
ALTER TABLE canvas_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view canvas items in their projects" ON canvas_items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = canvas_items.project_id
            AND (
                p.created_by = auth.uid() 
                OR 
                EXISTS (
                    SELECT 1 FROM project_collaborators pc 
                    WHERE pc.project_id = p.id 
                    AND pc.user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Users can create canvas items in their projects" ON canvas_items
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = canvas_items.project_id
            AND (
                p.created_by = auth.uid() 
                OR 
                EXISTS (
                    SELECT 1 FROM project_collaborators pc 
                    WHERE pc.project_id = p.id 
                    AND pc.user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Users can update their own canvas items" ON canvas_items
    FOR UPDATE
    USING (created_by = auth.uid())
    WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete their own canvas items" ON canvas_items
    FOR DELETE
    USING (created_by = auth.uid());

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_chat_messages_updated_at
    BEFORE UPDATE ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_canvas_items_updated_at
    BEFORE UPDATE ON canvas_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 