import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { saveUserLLMSettings, getUserLLMSettings } from '../services/llmService'
import { supabase } from '../lib/supabaseClient'

interface PostgrestError {
  code: string;
  message: string;
  details: string | null;
  hint: string | null;
}

interface LLMState {
  selectedLLM: string | null
  apiKey: string | null
  isLoading: boolean
  error: string | null
  initialized: boolean
  setLLM: (llm: string, apiKey: string) => Promise<void>
  loadStoredSettings: () => Promise<void>
  clearLLM: () => void
  resetInitialized: () => void
}

const useLLMStore = create<LLMState>()(
  persist(
    (set, get) => ({
      selectedLLM: null,
      apiKey: null,
      isLoading: false,
      error: null,
      initialized: false,
      setLLM: async (llm: string, apiKey: string) => {
        set({ isLoading: true, error: null })
        try {
          const settings = await saveUserLLMSettings(llm, apiKey)
          if (settings?.llm_configuration) {
            set({ 
              selectedLLM: settings.llm_configuration.model_id,
              apiKey: settings.encrypted_api_key,
              isLoading: false,
              error: null,
              initialized: true
            })
          }
        } catch (error) {
          console.error('Error saving LLM settings:', error)
          let errorMessage = 'Unable to save LLM settings. Please try again.'
          
          if (error instanceof Error) {
            const dbError = error as unknown as PostgrestError
            if (dbError.code === '23505' || error.message.includes('duplicate key value')) {
              // This should not happen anymore since we handle it in the service
              errorMessage = 'Updating existing configuration...'
              try {
                // Try to load the existing settings
                await get().loadStoredSettings()
                return
              } catch {
                errorMessage = 'Failed to load existing settings. Please try again.'
              }
            } else if (error.message.includes('not authenticated')) {
              errorMessage = 'Please sign in to save your LLM settings.'
            }
          }
          
          set({ error: errorMessage, isLoading: false })
          throw new Error(errorMessage)
        }
      },
      loadStoredSettings: async () => {
        const state = get()
        if (state.isLoading) return // Prevent multiple simultaneous loads
        
        set({ isLoading: true, error: null })
        try {
          // First check if we have a session
          const { data: { session } } = await supabase.auth.getSession()
          if (!session) {
            set({ 
              isLoading: false, 
              selectedLLM: null, 
              apiKey: null,
              initialized: true,
              error: null
            })
            return
          }

          const settings = await getUserLLMSettings()
          if (settings?.llm_configuration) {
            set({
              selectedLLM: settings.llm_configuration.model_id,
              apiKey: settings.encrypted_api_key,
              isLoading: false,
              error: null,
              initialized: true
            })
          } else {
            set({ 
              isLoading: false, 
              selectedLLM: null, 
              apiKey: null,
              initialized: true,
              error: null
            })
          }
        } catch (error) {
          console.error('Error loading LLM settings:', error)
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'Failed to load LLM settings'
          set({ 
            error: errorMessage, 
            isLoading: false, 
            selectedLLM: null, 
            apiKey: null,
            initialized: true 
          })
        }
      },
      clearLLM: () => set({ 
        selectedLLM: null, 
        apiKey: null, 
        error: null,
        initialized: true 
      }),
      resetInitialized: () => set({ initialized: false }),
    }),
    {
      name: 'llm-storage',
      partialize: (state) => ({ 
        selectedLLM: state.selectedLLM,
        initialized: state.initialized 
      }), // Only persist selectedLLM and initialized state in localStorage
    }
  )
)

export default useLLMStore 