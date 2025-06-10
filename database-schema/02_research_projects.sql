-- Research Projects Schema
-- Based on the ResearchProject interface from ResearchTable.tsx

-- Research projects table
CREATE TABLE public.research_projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('paper', 'project', 'collaboration')),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'in-review', 'draft', 'active', 'completed', 'archived')),
    owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    doi VARCHAR(100), -- For published papers
    journal VARCHAR(200), -- For published papers
    abstract TEXT,
    keywords TEXT[],
    research_area VARCHAR(100),
    funding_source VARCHAR(200),
    visibility VARCHAR(20) DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'collaborators')),
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0
);

-- Project collaborators - many-to-many relationship
CREATE TABLE public.project_collaborators (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.research_projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'collaborator' CHECK (role IN ('owner', 'co-author', 'collaborator', 'reviewer', 'viewer')),
    permissions TEXT[] DEFAULT ARRAY['read'], -- ['read', 'write', 'admin']
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invited_by UUID REFERENCES public.users(id),
    invitation_status VARCHAR(20) DEFAULT 'pending' CHECK (invitation_status IN ('pending', 'accepted', 'declined', 'revoked')),
    UNIQUE(project_id, user_id)
);

-- Project tags for categorization
CREATE TABLE public.project_tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(7), -- Hex color code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    usage_count INTEGER DEFAULT 0
);

-- Project-tag relationship
CREATE TABLE public.project_tag_associations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.research_projects(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.project_tags(id) ON DELETE CASCADE,
    UNIQUE(project_id, tag_id)
);

-- Project files and attachments
CREATE TABLE public.project_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.research_projects(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    file_type VARCHAR(20) CHECK (file_type IN ('document', 'image', 'data', 'code', 'other')),
    uploaded_by UUID REFERENCES public.users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    description TEXT,
    is_primary BOOLEAN DEFAULT FALSE -- Primary document for the project
);

-- Project activity log
CREATE TABLE public.project_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.research_projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- 'created', 'updated', 'shared', 'published', etc.
    description TEXT,
    metadata JSONB, -- Additional data about the action
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Research metrics and analytics
CREATE TABLE public.project_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.research_projects(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    citations INTEGER DEFAULT 0,
    UNIQUE(project_id, metric_date)
);

-- Project likes/favorites
CREATE TABLE public.project_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.research_projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_research_projects_owner_id ON public.research_projects(owner_id);
CREATE INDEX idx_research_projects_status ON public.research_projects(status);
CREATE INDEX idx_research_projects_type ON public.research_projects(type);
CREATE INDEX idx_research_projects_created_at ON public.research_projects(created_at);
CREATE INDEX idx_research_projects_updated_at ON public.research_projects(updated_at);
CREATE INDEX idx_project_collaborators_project_id ON public.project_collaborators(project_id);
CREATE INDEX idx_project_collaborators_user_id ON public.project_collaborators(user_id);
CREATE INDEX idx_project_files_project_id ON public.project_files(project_id);
CREATE INDEX idx_project_activities_project_id ON public.project_activities(project_id);
CREATE INDEX idx_project_metrics_project_id ON public.project_metrics(project_id);
CREATE INDEX idx_project_metrics_date ON public.project_metrics(metric_date);
CREATE INDEX idx_project_likes_project_id ON public.project_likes(project_id);
CREATE INDEX idx_project_likes_user_id ON public.project_likes(user_id);

-- Row Level Security
ALTER TABLE public.research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for research projects
CREATE POLICY "Users can view public projects" ON public.research_projects
    FOR SELECT USING (visibility = 'public');

CREATE POLICY "Users can view own projects" ON public.research_projects
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Collaborators can view projects" ON public.research_projects
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.project_collaborators 
            WHERE project_id = id 
            AND user_id = auth.uid() 
            AND invitation_status = 'accepted'
        )
    );

CREATE POLICY "Users can update own projects" ON public.research_projects
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own projects" ON public.research_projects
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Update triggers
CREATE TRIGGER update_research_projects_updated_at BEFORE UPDATE ON public.research_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update project metrics
CREATE OR REPLACE FUNCTION increment_project_view()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.research_projects 
    SET view_count = view_count + 1 
    WHERE id = NEW.project_id;
    RETURN NEW;
END;
$$ language 'plpgsql'; 