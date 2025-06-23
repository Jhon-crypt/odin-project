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
        // Update local state with the content
        set({ content: content.trim() })
      } else {
        // If content is empty, just set local state to empty
        set({ content: '' })
      }
    } catch (error) {
      console.error('Error in debouncedUpdate:', error)
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while updating the document'
      })
    }
  }, 300)

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
          .order('created_at', { ascending: false })
          .limit(1)

        if (fetchError) throw fetchError

        // Reset content if no items found
        if (!items || items.length === 0) {
          set({ content: '', isLoading: false })
          return
        }

        // Only set content if it exists and is not empty
        const content = items[0]?.content?.text?.trim() || ''
        set({ content, isLoading: false })
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
        // Update local state immediately
        set({ content: content.trim() })
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
      // Update local state immediately
      const trimmedContent = content.trim()
      set({ content: trimmedContent })
      debouncedUpdate(projectId, trimmedContent)
    },

    setContent: (content: string) => set({ content: content.trim() }),
    setIsEditing: (isEditing: boolean) => {
      set({ isEditing })
      if (!isEditing) {
        debouncedUpdate.cancel()
      }
    },
  }
})

export default useResearchStore 