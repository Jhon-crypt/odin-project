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
          throw error
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