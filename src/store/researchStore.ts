import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'
import { debounce } from 'lodash'
import type { StoreApi, SetState } from 'zustand'

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

interface ResearchState {
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

const useResearchStore = create<ResearchState>((set) => {
  // Create a debounced version of updateDocument
  const debouncedUpdate = debounce(async (projectId: string, content: string) => {
    try {
      const { data: user, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user?.user) throw new Error('User not authenticated')

      // Always delete existing content first
      const { error: deleteError } = await supabase
        .from('canvas_items')
        .delete()
        .eq('project_id', projectId)
        .eq('type', 'text')

      if (deleteError) throw deleteError

      // Set local state to empty immediately after deletion
      set({ content: '' })

      // Only create new content if there's actual text
      const trimmedContent = content.trim()
      if (trimmedContent) {
        const { error: createError } = await supabase
          .from('canvas_items')
          .insert({
            project_id: projectId,
            type: 'text',
            content: { text: trimmedContent },
            position: { x: 0, y: 0 },
            created_by: user.user.id,
          })

        if (createError) throw createError
        // Update local state with the new content
        set({ content: trimmedContent })
      }
    } catch (error) {
      console.error('Error in debouncedUpdate:', error)
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while updating the document'
      })
    }
  }, 100) // Reduced debounce time for more immediate response

  return {
    content: '',
    isLoading: false,
    error: null,
    isEditing: false,

    fetchDocument: async (projectId: string) => {
      console.log('Fetching canvas items for project:', projectId)
      try {
        set({ isLoading: true, error: null, content: '' }) // Reset content immediately
        
        const { data: items, error: fetchError } = await supabase
          .from('canvas_items')
          .select('*')
          .eq('project_id', projectId)
          .eq('type', 'text')
          .order('created_at', { ascending: false })
          .limit(1)

        if (fetchError) throw fetchError

        // Only set content if we have valid data
        if (items?.[0]?.content?.text) {
          const trimmedContent = items[0].content.text.trim()
          set({ content: trimmedContent || '', isLoading: false })
        } else {
          set({ content: '', isLoading: false })
        }
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
        
        // If content is empty, just delete everything
        if (!content.trim()) {
          const { error: deleteError } = await supabase
            .from('canvas_items')
            .delete()
            .eq('project_id', projectId)
            .eq('type', 'text')

          if (deleteError) throw deleteError
          set({ content: '' })
        } else {
          await debouncedUpdate(projectId, content)
        }
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
      const trimmedContent = content.trim()
      set({ content: trimmedContent })
      if (!trimmedContent) {
        // If content is empty, delete immediately without debounce
        set({ isLoading: true })
        supabase
          .from('canvas_items')
          .delete()
          .eq('project_id', projectId)
          .eq('type', 'text')
          .then(() => set({ isLoading: false }))
          .catch(error => {
            console.error('Error deleting content:', error)
            set({ isLoading: false })
          })
      } else {
        debouncedUpdate(projectId, trimmedContent)
      }
    },

    setContent: (content: string) => {
      const trimmedContent = content.trim()
      set({ content: trimmedContent })
    },
    
    setIsEditing: (isEditing: boolean) => {
      set({ isEditing })
      if (!isEditing) {
        debouncedUpdate.cancel()
      }
    },
  }
})

export default useResearchStore 