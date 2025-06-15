import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LLMState {
  selectedLLM: string | null
  apiKey: string | null
  setLLM: (llm: string, apiKey: string) => void
  clearLLM: () => void
}

const useLLMStore = create<LLMState>()(
  persist(
    (set) => ({
      selectedLLM: null,
      apiKey: null,
      setLLM: (llm: string, apiKey: string) => set({ selectedLLM: llm, apiKey }),
      clearLLM: () => set({ selectedLLM: null, apiKey: null }),
    }),
    {
      name: 'llm-storage',
      partialize: (state) => ({ selectedLLM: state.selectedLLM }), // Don't persist API key in localStorage
    }
  )
)

export default useLLMStore 