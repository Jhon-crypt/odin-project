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
      
      // First check if a document exists
      const { data: existingDoc, error: fetchError } = await supabase
        .from('research_documents')
        .select('content')
        .eq('project_id', projectId)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw fetchError
      }

      // If no document exists, create one
      if (!existingDoc) {
        const user = (await supabase.auth.getUser()).data.user
        if (!user) throw new Error('User not authenticated')

        const { data: newDoc, error: createError } = await supabase
          .from('research_documents')
          .insert({
            project_id: projectId,
            content: '',
            created_by: user.id,
          })
          .select('content')
          .single()

        if (createError) throw createError
        set({ content: newDoc?.content || '' })
      } else {
        set({ content: existingDoc.content || '' })
      }
    } catch (error) {
      set({ error: (error as Error).message })
      console.error('Error fetching document:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  updateDocument: async (projectId: string, content: string) => {
    try {
      set({ isLoading: true, error: null })
      const user = (await supabase.auth.getUser()).data.user
      if (!user) throw new Error('User not authenticated')

      const { error: updateError } = await supabase
        .from('research_documents')
        .upsert({
          project_id: projectId,
          content,
          created_by: user.id,
          updated_at: new Date().toISOString(),
        })

      if (updateError) throw updateError
      set({ content })
    } catch (error) {
      set({ error: (error as Error).message })
      console.error('Error updating document:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  setIsEditing: (isEditing: boolean) => set({ isEditing }),
}))

export default useResearchStore 