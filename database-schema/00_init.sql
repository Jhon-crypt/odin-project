-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Set up auth schema
create schema if not exists auth;

-- Create custom types
CREATE TYPE project_status AS ENUM ('active', 'archived', 'deleted');
CREATE TYPE llm_provider AS ENUM ('OpenAI', 'Anthropic', 'Google');

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    display_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status project_status NOT NULL DEFAULT 'active',
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- LLM Configurations table
CREATE TABLE llm_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id VARCHAR(255) NOT NULL,
    provider llm_provider NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    is_deprecated BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User LLM Settings table (stores user's selected LLM and encrypted API key)
CREATE TABLE user_llm_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    llm_config_id UUID NOT NULL REFERENCES llm_configurations(id),
    encrypted_api_key TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, llm_config_id)
);

-- Research Documents table
CREATE TABLE research_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id),
    title VARCHAR(255),
    content TEXT NOT NULL DEFAULT '',
    metadata JSONB,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Research History table (tracks interactions and analysis)
CREATE TABLE research_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES research_documents(id),
    user_id UUID NOT NULL REFERENCES users(id),
    llm_config_id UUID NOT NULL REFERENCES llm_configurations(id),
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project Collaborators table
CREATE TABLE project_collaborators (
    project_id UUID NOT NULL REFERENCES projects(id),
    user_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (project_id, user_id)
);

-- Create indexes
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_research_documents_project_id ON research_documents(project_id);
CREATE INDEX idx_research_history_document_id ON research_history(document_id);
CREATE INDEX idx_research_history_user_id ON research_history(user_id);
CREATE INDEX idx_user_llm_settings_user_id ON user_llm_settings(user_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_llm_configurations_updated_at
    BEFORE UPDATE ON llm_configurations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_llm_settings_updated_at
    BEFORE UPDATE ON user_llm_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_research_documents_updated_at
    BEFORE UPDATE ON research_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_llm_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_collaborators ENABLE ROW LEVEL SECURITY;

-- Users RLS
CREATE POLICY "Users can view their own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

-- Projects RLS
DROP POLICY IF EXISTS "Users can view projects they have access to" ON projects;
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

-- LLM Configurations RLS
CREATE POLICY "Everyone can view LLM configurations"
    ON llm_configurations FOR SELECT
    USING (true);

-- User LLM Settings RLS
CREATE POLICY "Users can manage their own LLM settings"
    ON user_llm_settings FOR ALL
    USING (auth.uid() = user_id);

-- Research Documents RLS
CREATE POLICY "Users can view documents in their projects"
    ON research_documents FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects p
            LEFT JOIN project_collaborators pc ON pc.project_id = p.id
            WHERE p.id = research_documents.project_id
            AND (p.created_by = auth.uid() OR pc.user_id = auth.uid())
        )
    );

-- Research History RLS
CREATE POLICY "Users can view their own research history"
    ON research_history FOR SELECT
    USING (auth.uid() = user_id);

-- Project Collaborators RLS
CREATE POLICY "Project owners can manage collaborators"
    ON project_collaborators FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE id = project_collaborators.project_id
            AND created_by = auth.uid()
        )
    ); 