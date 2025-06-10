-- Research Analytics and Metrics Schema
-- Based on the ResearchHistoryCard component and analytics requirements

-- Research analytics aggregated by time periods
CREATE TABLE public.research_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.research_projects(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly', 'yearly')),
    
    -- Activity metrics
    papers_published INTEGER DEFAULT 0,
    projects_created INTEGER DEFAULT 0,
    collaborations_started INTEGER DEFAULT 0,
    total_publications INTEGER DEFAULT 0,
    
    -- Engagement metrics
    profile_views INTEGER DEFAULT 0,
    project_views INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    citations INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    
    -- Collaboration metrics
    new_collaborators INTEGER DEFAULT 0,
    messages_sent INTEGER DEFAULT 0,
    comments_made INTEGER DEFAULT 0,
    reviews_completed INTEGER DEFAULT 0,
    
    -- Research output metrics
    words_written INTEGER DEFAULT 0,
    data_uploaded_mb DECIMAL(10,2) DEFAULT 0,
    experiments_conducted INTEGER DEFAULT 0,
    analyses_completed INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, project_id, metric_date, period_type)
);

-- User research milestones and achievements
CREATE TABLE public.research_milestones (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    milestone_type VARCHAR(50) NOT NULL, -- 'first_paper', 'citation_milestone', 'collaboration_count', etc.
    title VARCHAR(255) NOT NULL,
    description TEXT,
    value_achieved INTEGER, -- Numeric value if applicable
    threshold_reached INTEGER, -- The milestone threshold
    project_id UUID REFERENCES public.research_projects(id),
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_public BOOLEAN DEFAULT TRUE,
    celebration_shown BOOLEAN DEFAULT FALSE
);

-- Research trends and patterns
CREATE TABLE public.research_trends (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    trend_type VARCHAR(50) NOT NULL, -- 'productivity', 'collaboration', 'impact', etc.
    trend_period VARCHAR(20) NOT NULL, -- 'this_month', 'this_year', 'last_6_months', etc.
    trend_direction VARCHAR(10) CHECK (trend_direction IN ('up', 'down', 'stable')),
    percentage_change DECIMAL(5,2), -- -100.00 to 999.99
    current_value DECIMAL(10,2),
    previous_value DECIMAL(10,2),
    confidence_level DECIMAL(3,2), -- 0.00 to 1.00
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE
);

-- User research goals and targets
CREATE TABLE public.research_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    goal_type VARCHAR(50) NOT NULL, -- 'publications', 'citations', 'collaborations', etc.
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_value INTEGER NOT NULL,
    current_progress INTEGER DEFAULT 0,
    target_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Research collaboration network analytics
CREATE TABLE public.collaboration_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    collaborator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    collaboration_strength DECIMAL(3,2), -- 0.00 to 1.00
    projects_together INTEGER DEFAULT 0,
    papers_coauthored INTEGER DEFAULT 0,
    messages_exchanged INTEGER DEFAULT 0,
    last_collaboration_date DATE,
    network_centrality DECIMAL(5,4), -- Network analysis metric
    influence_score DECIMAL(5,2),
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, collaborator_id)
);

-- Research impact metrics
CREATE TABLE public.research_impact (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.research_projects(id) ON DELETE CASCADE,
    impact_type VARCHAR(30) NOT NULL, -- 'academic', 'social', 'economic', 'policy'
    metric_name VARCHAR(50) NOT NULL, -- 'h_index', 'altmetric_score', 'media_mentions', etc.
    metric_value DECIMAL(10,2),
    percentile_rank DECIMAL(5,2), -- 0.00 to 100.00
    field_comparison VARCHAR(100), -- Field or discipline for comparison
    data_source VARCHAR(50), -- 'google_scholar', 'scopus', 'altmetric', etc.
    measurement_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User analytics preferences and dashboard settings
CREATE TABLE public.analytics_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    dashboard_layout JSONB DEFAULT '{"widgets": [], "layout": "default"}',
    preferred_time_range VARCHAR(20) DEFAULT 'last_month',
    preferred_metrics TEXT[] DEFAULT ARRAY['publications', 'collaborations', 'citations'],
    show_comparisons BOOLEAN DEFAULT TRUE,
    show_trends BOOLEAN DEFAULT TRUE,
    show_goals BOOLEAN DEFAULT TRUE,
    email_reports BOOLEAN DEFAULT FALSE,
    report_frequency VARCHAR(20) DEFAULT 'monthly' CHECK (report_frequency IN ('weekly', 'monthly', 'quarterly')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comparative analytics (year over year, peer comparison)
CREATE TABLE public.comparative_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    comparison_type VARCHAR(30) NOT NULL, -- 'year_over_year', 'peer_group', 'field_average'
    metric_name VARCHAR(50) NOT NULL,
    current_period_value DECIMAL(10,2),
    comparison_period_value DECIMAL(10,2),
    percentage_change DECIMAL(5,2),
    comparison_group VARCHAR(100), -- Description of comparison group
    current_period_start DATE,
    current_period_end DATE,
    comparison_period_start DATE,
    comparison_period_end DATE,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_research_analytics_user_id ON public.research_analytics(user_id);
CREATE INDEX idx_research_analytics_project_id ON public.research_analytics(project_id);
CREATE INDEX idx_research_analytics_date ON public.research_analytics(metric_date);
CREATE INDEX idx_research_analytics_period ON public.research_analytics(period_type);
CREATE INDEX idx_research_milestones_user_id ON public.research_milestones(user_id);
CREATE INDEX idx_research_milestones_achieved ON public.research_milestones(achieved_at);
CREATE INDEX idx_research_trends_user_id ON public.research_trends(user_id);
CREATE INDEX idx_research_trends_calculated ON public.research_trends(calculated_at);
CREATE INDEX idx_research_goals_user_id ON public.research_goals(user_id);
CREATE INDEX idx_research_goals_status ON public.research_goals(status);
CREATE INDEX idx_collaboration_analytics_user_id ON public.collaboration_analytics(user_id);
CREATE INDEX idx_collaboration_analytics_collaborator ON public.collaboration_analytics(collaborator_id);
CREATE INDEX idx_research_impact_project_id ON public.research_impact(project_id);
CREATE INDEX idx_research_impact_date ON public.research_impact(measurement_date);

-- Row Level Security
ALTER TABLE public.research_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_impact ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparative_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own analytics" ON public.research_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own milestones" ON public.research_milestones
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public milestones" ON public.research_milestones
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own trends" ON public.research_trends
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own goals" ON public.research_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON public.research_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON public.research_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update triggers
CREATE TRIGGER update_research_goals_updated_at BEFORE UPDATE ON public.research_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_preferences_updated_at BEFORE UPDATE ON public.analytics_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 