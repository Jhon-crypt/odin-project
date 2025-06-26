-- First drop the existing foreign key constraint
ALTER TABLE research_documents
DROP CONSTRAINT IF EXISTS research_documents_project_id_fkey;

-- Re-create the constraint with ON DELETE CASCADE
ALTER TABLE research_documents
ADD CONSTRAINT research_documents_project_id_fkey
FOREIGN KEY (project_id)
REFERENCES projects(id)
ON DELETE CASCADE; 