import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

interface ResearchStore {
  content: string
  isLoading: boolean
  error: string | null
  isEditing: boolean
  fetchDocument: (projectId: string) => Promise<void>
  updateDocument: (projectId: string, content: string) => Promise<void>
  setIsEditing: (isEditing: boolean) => void
}

const useResearchStore = create<ResearchStore>((set) => ({
  content: '',
  isLoading: false,
  error: null,
  isEditing: false,

  fetchDocument: async (projectId: string) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await supabase
        .from('research_documents')
        .select('content')
        .eq('project_id', projectId)
        .single()

      if (error) throw error
      set({ content: data?.content || '' })
    } catch (error) {
      set({ error: (error as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },

  updateDocument: async (projectId: string, content: string) => {
    try {
      set({ isLoading: true, error: null })
      const user = (await supabase.auth.getUser()).data.user
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('research_documents')
        .upsert({
          project_id: projectId,
          content,
          created_by: user.id,
        })

      if (error) throw error
      set({ content })
    } catch (error) {
      set({ error: (error as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },

  setIsEditing: (isEditing: boolean) => set({ isEditing }),
}))

export default useResearchStore 