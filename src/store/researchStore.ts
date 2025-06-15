import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

interface ResearchStore {
  content: string
  title: string
  isLoading: boolean
  error: string | null
  isEditing: boolean
  fetchDocument: (projectId: string) => Promise<void>
  updateDocument: (projectId: string, content: string, title?: string) => Promise<void>
  setIsEditing: (isEditing: boolean) => void
}

const useResearchStore = create<ResearchStore>((set) => ({
  content: '',
  title: '',
  isLoading: false,
  error: null,
  isEditing: false,

  fetchDocument: async (projectId: string) => {
    try {
      set({ isLoading: true, error: null })
      
      // Fetch canvas items
      const { data: canvasItems, error: canvasError } = await supabase
        .from('canvas_items')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

      if (canvasError) throw canvasError

      // Combine all text content from canvas items
      const content = canvasItems
        ?.filter(item => item.type === 'text')
        .map(item => (item.content as { text: string }).text)
        .join('\n\n') || ''

      // Get project title
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('name')
        .eq('id', projectId)
        .single()

      if (projectError) throw projectError

      set({ 
        content,
        title: project?.name || 'Untitled Research'
      })
    } catch (error) {
      set({ error: (error as Error).message })
      console.error('Error fetching document:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  updateDocument: async (projectId: string, content: string, title?: string) => {
    try {
      set({ isLoading: true, error: null })
      const user = (await supabase.auth.getUser()).data.user
      if (!user) throw new Error('User not authenticated')

      // Update project title if provided
      if (title !== undefined) {
        const { error: titleError } = await supabase
          .from('projects')
          .update({ name: title })
          .eq('id', projectId)

        if (titleError) throw titleError
      }

      // Update canvas items
      // First, remove all existing text items
      const { error: deleteError } = await supabase
        .from('canvas_items')
        .delete()
        .eq('project_id', projectId)
        .eq('type', 'text')

      if (deleteError) throw deleteError

      // Then add the new content as a single text item
      const { error: insertError } = await supabase
        .from('canvas_items')
        .insert({
          project_id: projectId,
          type: 'text',
          content: { text: content },
          position: { x: 0, y: 0 },
          created_by: user.id,
        })

      if (insertError) throw insertError

      set((state) => ({ 
        content,
        title: title !== undefined ? title : state.title
      }))
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