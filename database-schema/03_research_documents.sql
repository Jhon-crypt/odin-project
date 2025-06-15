-- Enable RLS
ALTER TABLE research_documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their research documents" ON research_documents;
DROP POLICY IF EXISTS "Users can create research documents" ON research_documents;
DROP POLICY IF EXISTS "Users can update their research documents" ON research_documents;
DROP POLICY IF EXISTS "Users can delete their research documents" ON research_documents;

-- Create policies for research_documents
CREATE POLICY "Users can view their research documents"
    ON research_documents FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects p
            LEFT JOIN project_collaborators pc ON pc.project_id = p.id
            WHERE p.id = research_documents.project_id
            AND (p.created_by = auth.uid() OR pc.user_id = auth.uid())
        )
    );

CREATE POLICY "Users can create research documents"
    ON research_documents FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects p
            LEFT JOIN project_collaborators pc ON pc.project_id = p.id
            WHERE p.id = research_documents.project_id
            AND (p.created_by = auth.uid() OR pc.user_id = auth.uid())
        )
    );

CREATE POLICY "Users can update their research documents"
    ON research_documents FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM projects p
            LEFT JOIN project_collaborators pc ON pc.project_id = p.id
            WHERE p.id = research_documents.project_id
            AND (p.created_by = auth.uid() OR pc.user_id = auth.uid())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects p
            LEFT JOIN project_collaborators pc ON pc.project_id = p.id
            WHERE p.id = research_documents.project_id
            AND (p.created_by = auth.uid() OR pc.user_id = auth.uid())
        )
    );

CREATE POLICY "Users can delete their research documents"
    ON research_documents FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM projects p
            LEFT JOIN project_collaborators pc ON pc.project_id = p.id
            WHERE p.id = research_documents.project_id
            AND (p.created_by = auth.uid() OR pc.user_id = auth.uid())
        )
    ); 