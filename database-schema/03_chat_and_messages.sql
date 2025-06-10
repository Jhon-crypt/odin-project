-- Chat and Messages Schema
-- Based on the ChatArea component and conversation flow

-- Chat sessions/conversations
CREATE TABLE public.chat_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.research_projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255), -- Generated or user-defined title
    context_type VARCHAR(20) DEFAULT 'research' CHECK (context_type IN ('research', 'analysis', 'collaboration', 'general')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_at TIMESTAMP WITH TIME ZONE
);

-- Messages within chat sessions
CREATE TABLE public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB, -- For storing additional message data like formatting, attachments, etc.
    parent_message_id UUID REFERENCES public.chat_messages(id), -- For threaded conversations
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Message reactions/interactions
CREATE TABLE public.message_reactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    message_id UUID REFERENCES public.chat_messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL CHECK (reaction_type IN ('like', 'dislike', 'helpful', 'accurate', 'bookmark')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(message_id, user_id, reaction_type)
);

-- AI Assistant responses and configurations
CREATE TABLE public.ai_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    message_id UUID REFERENCES public.chat_messages(id) ON DELETE CASCADE,
    model_name VARCHAR(50), -- GPT-4, Claude, etc.
    model_version VARCHAR(20),
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    total_tokens INTEGER,
    response_time_ms INTEGER,
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    temperature DECIMAL(3,2),
    max_tokens INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message attachments (images, files, etc.)
CREATE TABLE public.message_attachments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    message_id UUID REFERENCES public.chat_messages(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    attachment_type VARCHAR(20) CHECK (attachment_type IN ('image', 'document', 'data', 'code', 'other')),
    thumbnail_path TEXT, -- For image previews
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat session participants (for group conversations)
CREATE TABLE public.chat_participants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'participant' CHECK (role IN ('owner', 'admin', 'participant', 'observer')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_read_at TIMESTAMP WITH TIME ZONE,
    notification_settings JSONB DEFAULT '{"mentions": true, "all_messages": false}',
    UNIQUE(session_id, user_id)
);

-- Chat templates for common research queries
CREATE TABLE public.chat_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50), -- 'analysis', 'literature-review', 'methodology', etc.
    template_content TEXT NOT NULL,
    variables JSONB, -- Template variables that can be filled in
    created_by UUID REFERENCES public.users(id),
    is_public BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User chat preferences
CREATE TABLE public.user_chat_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    ai_model_preference VARCHAR(50) DEFAULT 'gpt-4',
    response_style VARCHAR(20) DEFAULT 'balanced' CHECK (response_style IN ('concise', 'balanced', 'detailed')),
    language_preference VARCHAR(10) DEFAULT 'en',
    theme VARCHAR(20) DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'auto')),
    notification_sound BOOLEAN DEFAULT TRUE,
    show_typing_indicator BOOLEAN DEFAULT TRUE,
    auto_save_conversations BOOLEAN DEFAULT TRUE,
    message_history_limit INTEGER DEFAULT 1000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_chat_sessions_project_id ON public.chat_sessions(project_id);
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_updated_at ON public.chat_sessions(updated_at);
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX idx_chat_messages_message_type ON public.chat_messages(message_type);
CREATE INDEX idx_message_reactions_message_id ON public.message_reactions(message_id);
CREATE INDEX idx_message_reactions_user_id ON public.message_reactions(user_id);
CREATE INDEX idx_ai_responses_message_id ON public.ai_responses(message_id);
CREATE INDEX idx_message_attachments_message_id ON public.message_attachments(message_id);
CREATE INDEX idx_chat_participants_session_id ON public.chat_participants(session_id);
CREATE INDEX idx_chat_participants_user_id ON public.chat_participants(user_id);

-- Row Level Security
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_chat_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own chat sessions" ON public.chat_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Participants can view chat sessions" ON public.chat_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chat_participants 
            WHERE session_id = id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own chat sessions" ON public.chat_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat sessions" ON public.chat_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Message policies
CREATE POLICY "Participants can view messages" ON public.chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chat_sessions cs
            WHERE cs.id = session_id 
            AND (cs.user_id = auth.uid() OR 
                 EXISTS (SELECT 1 FROM public.chat_participants cp 
                        WHERE cp.session_id = cs.id AND cp.user_id = auth.uid()))
        )
    );

CREATE POLICY "Users can insert messages" ON public.chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update triggers
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at BEFORE UPDATE ON public.chat_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_chat_preferences_updated_at BEFORE UPDATE ON public.user_chat_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update last_message_at on chat_sessions
CREATE OR REPLACE FUNCTION update_chat_session_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.chat_sessions 
    SET last_message_at = NEW.created_at,
        updated_at = NEW.created_at
    WHERE id = NEW.session_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_session_last_message AFTER INSERT ON public.chat_messages
    FOR EACH ROW EXECUTE FUNCTION update_chat_session_last_message(); 