-- Seed LLM Configurations
INSERT INTO llm_configurations 
    (model_id, provider, display_name, description, is_deprecated)
VALUES
    -- OpenAI Models
    (
        'gpt-4.1',
        'OpenAI',
        'GPT-4.1',
        'Flagship GPT model for complex tasks',
        false
    ),
    (
        'o4-mini',
        'OpenAI',
        'o4-mini',
        'Faster, more affordable reasoning model',
        false
    ),
    (
        'o3',
        'OpenAI',
        'o3',
        'Our most powerful reasoning model',
        false
    ),
    (
        'o3-pro',
        'OpenAI',
        'o3-pro',
        'Version of o3 with more compute for better responses',
        false
    ),
    (
        'o3-mini',
        'OpenAI',
        'o3-mini',
        'A small model alternative to o3',
        false
    ),
    (
        'o1',
        'OpenAI',
        'o1',
        'Previous full o-series reasoning model',
        false
    ),
    (
        'o1-pro',
        'OpenAI',
        'o1-pro',
        'Version of o1 with more compute for better responses',
        false
    ),
    (
        'o1-mini',
        'OpenAI',
        'o1-mini',
        'A small model alternative to o1',
        true
    ),
    
    -- Anthropic Models
    (
        'claude-3-opus',
        'Anthropic',
        'Claude 3 Opus',
        'Most powerful Claude model for complex tasks',
        false
    ),
    (
        'claude-3-sonnet',
        'Anthropic',
        'Claude 3 Sonnet',
        'Balanced Claude model for general use',
        false
    );

-- Note: Google models are fetched dynamically from the API 