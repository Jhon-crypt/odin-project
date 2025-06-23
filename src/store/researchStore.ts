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

      // First, delete ALL existing text items for this project
      const { error: deleteError } = await supabase
        .from('canvas_items')
        .delete()
        .eq('project_id', projectId)
        .eq('type', 'text')

      if (deleteError) throw deleteError

      // Only create a new item if there's actual content
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

      // Update local state to match database
      set({ content: content.trim() })
    } catch (error) {
      console.error('Error in debouncedUpdate:', error)
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while updating the document'
      })
    }
  }, 1000)

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

        // Reset content if no items found
        if (!items || items.length === 0) {
          set({ content: '', isLoading: false })
          return
        }

        // Only use the most recent text item
        const latestItem = items.reduce((latest, current) => {
          if (!latest || new Date(current.created_at) > new Date(latest.created_at)) {
            return current
          }
          return latest
        }, null as CanvasItem | null)

        set({ 
          content: latestItem ? latestItem.content.text.trim() : '',
          isLoading: false 
        })
      } catch (error) {
        console.error('Error in fetchDocument:', error)
        set({ 
          error: error instanceof Error ? error.message : 'An error occurred while fetching the document',
          content: '',
          isLoading: false
        })
      }
    },

    updateDocument: async (projectId: string, content: string) => {
      console.log('Updating research document for project:', projectId)
      try {
        set({ isLoading: true, error: null })
        await debouncedUpdate.cancel() // Cancel any pending updates
        await debouncedUpdate(projectId, content)
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
      set({ content }) // Update local state immediately
      debouncedUpdate(projectId, content) // Debounce the server update
    },

    setContent: (content: string) => set({ content }),
    setIsEditing: (isEditing: boolean) => {
      set({ isEditing })
      if (!isEditing) {
        // When exiting edit mode, cancel any pending updates
        debouncedUpdate.cancel()
      }
    },
  }
})

export default useResearchStore 