import { supabase } from '../lib/supabaseClient'
import type { UserLLMSetting } from '../types/database'

export async function saveUserLLMSettings(modelId: string, apiKey: string) {
  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error('User not authenticated')

    // First, ensure the LLM configuration exists
    const { data: existingConfig, error: configError } = await supabase
      .from('llm_configurations')
      .select('id')
      .eq('model_id', modelId)
      .maybeSingle()

    if (configError) throw configError

    let llmConfigId: string

    if (!existingConfig) {
      // Create new configuration
      const { data: newConfig, error: createError } = await supabase
        .from('llm_configurations')
        .insert({
          model_id: modelId,
          provider: 'Google',
          display_name: modelId,
          description: 'Google AI model',
          is_deprecated: false
        })
        .select('id')
        .single()

      if (createError) throw createError
      if (!newConfig) throw new Error('Failed to create LLM configuration')
      
      llmConfigId = newConfig.id
    } else {
      llmConfigId = existingConfig.id
    }

    // Deactivate any existing active settings for this user
    await supabase
      .from('user_llm_settings')
      .update({ is_active: false })
      .eq('user_id', user.user.id)
      .eq('is_active', true)

    // Insert new settings
    const { error: settingsError } = await supabase
      .from('user_llm_settings')
      .insert({
        user_id: user.user.id,
        llm_config_id: llmConfigId,
        encrypted_api_key: apiKey,
        is_active: true
      })

    if (settingsError) throw settingsError

    return true
  } catch (error) {
    console.error('Error saving LLM settings:', error)
    throw error
  }
}

export async function getUserLLMSettings(): Promise<UserLLMSetting | null> {
  try {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_llm_settings')
      .select(`
        *,
        llm_configuration:llm_configurations (
          model_id,
          provider,
          display_name,
          description
        )
      `)
      .eq('user_id', user.user.id)
      .eq('is_active', true)
      .maybeSingle()

    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error fetching LLM settings:', error)
    return null
  }
} 