-- Make encrypted_api_key nullable since we're now using environment variables
-- for API keys instead of storing them per user

ALTER TABLE user_llm_settings 
ALTER COLUMN encrypted_api_key DROP NOT NULL;

-- Add a comment to document this change
COMMENT ON COLUMN user_llm_settings.encrypted_api_key IS 'API key is now optional as it can be configured via environment variables';
