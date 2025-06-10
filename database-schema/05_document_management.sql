-- Document Management Schema
-- Based on the ResearchCanvas component and document editing features

-- Research documents and papers
CREATE TABLE public.research_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.research_projects(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT, -- Main document content
    document_type VARCHAR(30) NOT NULL CHECK (document_type IN ('paper', 'notes', 'analysis', 'methodology', 'literature_review', 'draft')),
    format VARCHAR(20) DEFAULT 'markdown' CHECK (format IN ('markdown', 'latex', 'html', 'plain_text')),
    version_number INTEGER DEFAULT 1,
    is_current_version BOOLEAN DEFAULT TRUE,
    word_count INTEGER DEFAULT 0,
    character_count INTEGER DEFAULT 0,
    
    -- Document metadata
    abstract TEXT,
    keywords TEXT[],
    outline JSONB, -- Document structure/outline
    citations JSONB, -- Bibliography and citations
    figures_count INTEGER DEFAULT 0,
    tables_count INTEGER DEFAULT 0,
    
    -- Publication info
    journal VARCHAR(200),
    doi VARCHAR(100),
    isbn VARCHAR(20),
    publication_date DATE,
    submission_date DATE,
    review_status VARCHAR(20) CHECK (review_status IN ('draft', 'under_review', 'revision_requested', 'accepted', 'published')),
    
    -- Access and sharing
    visibility VARCHAR(20) DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'collaborators', 'institution')),
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    
    -- Tracking
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_edited_by UUID REFERENCES public.users(id),
    last_edited_at TIMESTAMP WITH TIME ZONE
);

-- Document versions for version control
CREATE TABLE public.document_versions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document_id UUID REFERENCES public.research_documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    title VARCHAR(500),
    content TEXT NOT NULL,
    content_diff TEXT, -- Diff from previous version
    change_summary TEXT,
    word_count INTEGER DEFAULT 0,
    character_count INTEGER DEFAULT 0,
    
    -- Version metadata
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    parent_version_id UUID REFERENCES public.document_versions(id),
    is_major_version BOOLEAN DEFAULT FALSE,
    version_tag VARCHAR(50), -- e.g., 'submitted', 'revision_1', 'final'
    
    UNIQUE(document_id, version_number)
);

-- Document sections for structured documents
CREATE TABLE public.document_sections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document_id UUID REFERENCES public.research_documents(id) ON DELETE CASCADE,
    section_type VARCHAR(30) NOT NULL, -- 'abstract', 'introduction', 'methods', 'results', 'discussion', 'conclusion', 'references'
    title VARCHAR(200),
    content TEXT,
    section_order INTEGER NOT NULL,
    parent_section_id UUID REFERENCES public.document_sections(id),
    level INTEGER DEFAULT 1, -- Heading level (1, 2, 3, etc.)
    word_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document comments and annotations
CREATE TABLE public.document_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document_id UUID REFERENCES public.research_documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    comment_type VARCHAR(20) DEFAULT 'general' CHECK (comment_type IN ('general', 'suggestion', 'question', 'correction', 'approval')),
    
    -- Position in document
    section_id UUID REFERENCES public.document_sections(id),
    start_position INTEGER, -- Character position
    end_position INTEGER,
    highlighted_text TEXT,
    
    -- Threading
    parent_comment_id UUID REFERENCES public.document_comments(id),
    
    -- Status
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'dismissed')),
    resolved_by UUID REFERENCES public.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document templates
CREATE TABLE public.document_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    template_type VARCHAR(30) NOT NULL, -- 'research_paper', 'grant_proposal', 'thesis', 'report'
    discipline VARCHAR(50), -- 'computer_science', 'biology', 'psychology', etc.
    content_template TEXT NOT NULL,
    sections_template JSONB, -- Predefined sections structure
    style_guide JSONB, -- Formatting and style preferences
    
    created_by UUID REFERENCES public.users(id),
    is_public BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document references and citations
CREATE TABLE public.document_references (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document_id UUID REFERENCES public.research_documents(id) ON DELETE CASCADE,
    reference_type VARCHAR(20) NOT NULL CHECK (reference_type IN ('journal_article', 'book', 'conference', 'website', 'dataset', 'software')),
    
    -- Citation details
    title TEXT NOT NULL,
    authors TEXT[], -- Array of author names
    journal VARCHAR(200),
    volume VARCHAR(20),
    issue VARCHAR(20),
    pages VARCHAR(20),
    year INTEGER,
    doi VARCHAR(100),
    url TEXT,
    isbn VARCHAR(20),
    publisher VARCHAR(200),
    
    -- Internal tracking
    citation_key VARCHAR(50), -- For LaTeX-style citations
    citation_order INTEGER,
    times_cited INTEGER DEFAULT 1,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document attachments (figures, tables, datasets)
CREATE TABLE public.document_attachments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document_id UUID REFERENCES public.research_documents(id) ON DELETE CASCADE,
    attachment_type VARCHAR(20) NOT NULL CHECK (attachment_type IN ('figure', 'table', 'dataset', 'supplementary', 'code')),
    title VARCHAR(200),
    caption TEXT,
    file_name VARCHAR(255),
    file_path TEXT,
    file_size BIGINT,
    mime_type VARCHAR(100),
    
    -- Position in document
    section_id UUID REFERENCES public.document_sections(id),
    attachment_order INTEGER,
    
    -- Metadata
    alt_text TEXT, -- For accessibility
    license VARCHAR(50),
    source_attribution TEXT,
    
    uploaded_by UUID REFERENCES public.users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document collaboration permissions
CREATE TABLE public.document_permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document_id UUID REFERENCES public.research_documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    permission_level VARCHAR(20) NOT NULL CHECK (permission_level IN ('read', 'comment', 'edit', 'admin')),
    granted_by UUID REFERENCES public.users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(document_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_research_documents_project_id ON public.research_documents(project_id);
CREATE INDEX idx_research_documents_created_by ON public.research_documents(created_by);
CREATE INDEX idx_research_documents_updated_at ON public.research_documents(updated_at);
CREATE INDEX idx_research_documents_type ON public.research_documents(document_type);
CREATE INDEX idx_document_versions_document_id ON public.document_versions(document_id);
CREATE INDEX idx_document_versions_created_at ON public.document_versions(created_at);
CREATE INDEX idx_document_sections_document_id ON public.document_sections(document_id);
CREATE INDEX idx_document_sections_order ON public.document_sections(section_order);
CREATE INDEX idx_document_comments_document_id ON public.document_comments(document_id);
CREATE INDEX idx_document_comments_user_id ON public.document_comments(user_id);
CREATE INDEX idx_document_references_document_id ON public.document_references(document_id);
CREATE INDEX idx_document_attachments_document_id ON public.document_attachments(document_id);
CREATE INDEX idx_document_permissions_document_id ON public.document_permissions(document_id);
CREATE INDEX idx_document_permissions_user_id ON public.document_permissions(user_id);

-- Row Level Security
ALTER TABLE public.research_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view public documents" ON public.research_documents
    FOR SELECT USING (visibility = 'public');

CREATE POLICY "Users can view own documents" ON public.research_documents
    FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users with permissions can view documents" ON public.research_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.document_permissions 
            WHERE document_id = id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own documents" ON public.research_documents
    FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Document editors can update" ON public.research_documents
    FOR UPDATE USING (
        created_by = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.document_permissions 
            WHERE document_id = id 
            AND user_id = auth.uid() 
            AND permission_level IN ('edit', 'admin')
        )
    );

-- Update triggers
CREATE TRIGGER update_research_documents_updated_at BEFORE UPDATE ON public.research_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_sections_updated_at BEFORE UPDATE ON public.document_sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_comments_updated_at BEFORE UPDATE ON public.document_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 