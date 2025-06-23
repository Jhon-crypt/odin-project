import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'
import debounce from 'lodash/debounce'

interface CanvasItem {
  id: string
  project_id: string
  type: string
  content: {
    text: string
  }
  position: {
    x: number
    y: number
  }
  created_by: string
  created_at: string
  updated_at: string
}

interface ResearchStore {
  content: string
  isLoading: boolean
  error: string | null
  isEditing: boolean
  fetchDocument: (projectId: string) => Promise<void>
  updateDocument: (projectId: string, content: string) => Promise<void>
  updateContentWithDebounce: (projectId: string, content: string) => void
  setContent: (content: string) => void
  setIsEditing: (isEditing: boolean) => void
}

const useResearchStore = create<ResearchStore>((set) => {
  // Create a debounced version of updateDocument
  const debouncedUpdate = debounce(async (projectId: string, content: string) => {
    try {
      const { data: user, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user?.user) throw new Error('User not authenticated')

      // First, get existing text items for this project
      const { data: existingItems, error: fetchError } = await supabase
        .from('canvas_items')
        .select('*')
        .eq('project_id', projectId)
        .eq('type', 'text')
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError

      // Delete all existing text items
      if (existingItems && existingItems.length > 0) {
        const itemIds = existingItems.map(item => item.id)
        const { error: deleteError } = await supabase
          .from('canvas_items')
          .delete()
          .in('id', itemIds)

        if (deleteError) throw deleteError
      }

      // Create a new item with the updated content
      if (content.trim()) {
        const { error: createError } = await supabase
          .from('canvas_items')
          .insert({
            project_id: projectId,
            type: 'text',
            content: { text: content.trim() },
            position: { x: 0, y: 0 },
            created_by: user.user.id,
          })

        if (createError) throw createError
      }
    } catch (error) {
      console.error('Error in debouncedUpdate:', error)
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while updating the document'
      })
    }
  }, 1000) // Debounce for 1 second

  return {
    content: '',
    isLoading: false,
    error: null,
    isEditing: false,

    fetchDocument: async (projectId: string) => {
      console.log('Fetching canvas items for project:', projectId)
      try {
        set({ isLoading: true, error: null })
        
        const { data: items, error: fetchError } = await supabase
          .from('canvas_items')
          .select('*')
          .eq('project_id', projectId)
          .eq('type', 'text')
          .order('created_at', { ascending: true })

        if (fetchError) throw fetchError

        if (!items || items.length === 0) {
          set({ content: '' })
          return
        }

        const combinedContent = (items as CanvasItem[])
          .filter(item => item.content?.text?.trim())
          .map(item => item.content.text.trim())
          .join('\n\n')

        set({ content: combinedContent })
      } catch (error) {
        console.error('Error in fetchDocument:', error)
        set({ 
          error: error instanceof Error ? error.message : 'An error occurred while fetching the document',
          content: ''
        })
      } finally {
        set({ isLoading: false })
      }
    },

    updateDocument: async (projectId: string, content: string) => {
      console.log('Updating research document for project:', projectId)
      try {
        set({ isLoading: true, error: null })
        await debouncedUpdate(projectId, content)
        set({ content: content.trim() })
      } catch (error) {
        console.error('Error in updateDocument:', error)
        set({ 
          error: error instanceof Error ? error.message : 'An error occurred while updating the document'
        })
      } finally {
        set({ isLoading: false })
      }
    },

    updateContentWithDebounce: (projectId: string, content: string) => {
      set({ content: content }) // Update local state immediately
      debouncedUpdate(projectId, content) // Debounce the server update
    },

    setContent: (content: string) => set({ content }),
    setIsEditing: (isEditing: boolean) => set({ isEditing }),
  }
})

export default useResearchStore 