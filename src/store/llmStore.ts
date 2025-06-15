import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { saveUserLLMSettings, getUserLLMSettings } from '../services/llmService'

interface LLMState {
  selectedLLM: string | null
  apiKey: string | null
  setLLM: (llm: string, apiKey: string) => Promise<void>
  loadStoredSettings: () => Promise<void>
  clearLLM: () => void
}

const useLLMStore = create<LLMState>()(
  persist(
    (set) => ({
      selectedLLM: null,
      apiKey: null,
      setLLM: async (llm: string, apiKey: string) => {
        try {
          await saveUserLLMSettings(llm, apiKey)
          set({ selectedLLM: llm, apiKey })
        } catch (error) {
          console.error('Error saving LLM settings:', error)
          // Check for specific error types and provide user-friendly messages
          if (error instanceof Error) {
            if (error.message.includes('duplicate key value violates unique constraint')) {
              throw new Error('You already have settings for this LLM model. Your settings will be updated.')
            } else if (error.message.includes('not authenticated')) {
              throw new Error('Please sign in to save your LLM settings.')
            }
          }
          // If no specific error is matched, throw a generic error
          throw new Error('Unable to save LLM settings. Please try again.')
        }
      },
      loadStoredSettings: async () => {
        try {
          const settings = await getUserLLMSettings()
          if (settings?.llm_configuration) {
            set({
              selectedLLM: settings.llm_configuration.model_id,
              apiKey: settings.encrypted_api_key
            })
          }
        } catch (error) {
          console.error('Error loading LLM settings:', error)
          // Don't throw here as we want to fail silently on load
        }
      },
      clearLLM: () => set({ selectedLLM: null, apiKey: null }),
    }),
    {
      name: 'llm-storage',
      partialize: (state) => ({ selectedLLM: state.selectedLLM }), // Still don't persist API key in localStorage
    }
  )
)

export default useLLMStore 