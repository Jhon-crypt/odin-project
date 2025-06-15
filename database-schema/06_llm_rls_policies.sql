-- Enable RLS on llm_configurations table
ALTER TABLE llm_configurations ENABLE ROW LEVEL SECURITY;

-- Enable RLS on user_llm_settings table
ALTER TABLE user_llm_settings ENABLE ROW LEVEL SECURITY;

-- Policies for llm_configurations table
CREATE POLICY "Enable read access for all users"
ON llm_configurations FOR SELECT
USING (true);

CREATE POLICY "Enable insert access for all users"
ON llm_configurations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable update access for all users"
ON llm_configurations FOR UPDATE
USING (true);

-- Policies for user_llm_settings table
CREATE POLICY "Users can view their own llm settings"
ON user_llm_settings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own llm settings"
ON user_llm_settings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own llm settings"
ON user_llm_settings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own llm settings"
ON user_llm_settings FOR DELETE
TO authenticated
USING (auth.uid() = user_id); 