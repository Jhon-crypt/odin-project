import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'
import debounce from 'lodash/debounce'

type ResearchStore = {
  content: string
  isLoading: boolean
  error: string | null
  isEditing: boolean
  clearContent: (projectId: string) => Promise<void>
  fetchDocument: (projectId: string) => Promise<void>
  updateDocument: (projectId: string, content: string) => Promise<void>
  updateContentWithDebounce: (projectId: string, content: string) => void
  setContent: (content: string) => void
  setIsEditing: (isEditing: boolean) => void
}

const debouncedUpdate = debounce(async (projectId: string, content: string) => {
  await useResearchStore.getState().updateDocument(projectId, content)
}, 100)

const useResearchStore = create<ResearchStore>((set) => ({
  content: '',
  isLoading: false,
  error: null,
  isEditing: false,

  clearContent: async (projectId: string) => {
    try {
      // Immediately clear the UI
      set({ content: '', isLoading: true, error: null })

      const { error: deleteError } = await supabase
        .from('canvas_items')
        .delete()
        .eq('project_id', projectId)
        .eq('type', 'text')

      if (deleteError) throw deleteError

      // Ensure the UI stays cleared
      set({ content: '', isLoading: false })
    } catch (error) {
      console.error('Error clearing content:', error)
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while clearing the document',
        isLoading: false
      })
      // Refetch to ensure consistent state
      useResearchStore.getState().fetchDocument(projectId)
    }
  },

  fetchDocument: async (projectId: string) => {
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
    try {
      set({ isLoading: true, error: null })
      await debouncedUpdate.cancel() // Cancel any pending updates
      
      // If content is empty, clear everything
      if (!content.trim()) {
        await useResearchStore.getState().clearContent(projectId)
        return
      }

      // Delete existing content first
      const { error: deleteError } = await supabase
        .from('canvas_items')
        .delete()
        .eq('project_id', projectId)
        .eq('type', 'text')

      if (deleteError) throw deleteError

      // Create new content
      const { data: user, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user?.user) throw new Error('User not authenticated')

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
      
      // Update UI immediately
      set({ content: content.trim(), isLoading: false })
    } catch (error) {
      console.error('Error in updateDocument:', error)
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while updating the document',
        isLoading: false
      })
      // Refetch to ensure consistent state
      useResearchStore.getState().fetchDocument(projectId)
    }
  },

  updateContentWithDebounce: (projectId: string, content: string) => {
    const trimmedContent = content.trim()
    // Update UI immediately
    set({ content: trimmedContent })
    
    // If content is empty, clear immediately without debounce
    if (!trimmedContent) {
      useResearchStore.getState().clearContent(projectId)
      return
    }
    
    debouncedUpdate(projectId, trimmedContent)
  },

  setContent: (content: string) => {
    set({ content: content.trim() })
  },
  
  setIsEditing: (isEditing: boolean) => {
    set({ isEditing })
  },
}))

export default useResearchStore 