import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

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
  setIsEditing: (isEditing: boolean) => void
}

const useResearchStore = create<ResearchStore>((set) => ({
  content: '',
  isLoading: false,
  error: null,
  isEditing: false,

  fetchDocument: async (projectId: string) => {
    console.log('Fetching canvas items for project:', projectId)
    try {
      // Reset state when fetching new project
      set({ isLoading: true, error: null, content: '', isEditing: false })
      
      // Get all canvas items for this project
      const { data: items, error: fetchError } = await supabase
        .from('canvas_items')
        .select('*')
        .eq('project_id', projectId)
        .eq('type', 'text')
        .order('created_at', { ascending: true })

      console.log('Fetch result:', { items, fetchError })

      if (fetchError) {
        console.error('Error fetching canvas items:', fetchError)
        throw fetchError
      }

      if (!items || items.length === 0) {
        console.log('No canvas items found')
        set({ content: '' })
        return
      }

      // Filter out empty items and combine their texts
      const combinedContent = (items as CanvasItem[])
        .filter(item => item.content?.text?.trim())
        .map(item => item.content.text.trim())
        .join('\n\n')

      console.log('Combined content:', combinedContent)
      set({ content: combinedContent })
    } catch (error) {
      console.error('Error in fetchDocument:', error)
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred while fetching the document',
        content: '' // Reset content on error
      })
    } finally {
      set({ isLoading: false })
    }
  },

  updateDocument: async (projectId: string, content: string) => {
    console.log('Updating research document for project:', projectId)
    try {
      set({ isLoading: true, error: null })
      
      const { data: user, error: userError } = await supabase.auth.getUser()
      if (userError) {
        console.error('Error getting user:', userError)
        throw userError
      }
      if (!user?.user) {
        console.error('No user found')
        throw new Error('User not authenticated')
      }

      // First, get existing text items for this project
      const { data: existingItems, error: fetchError } = await supabase
        .from('canvas_items')
        .select('*')
        .eq('project_id', projectId)
        .eq('type', 'text')
        .order('created_at', { ascending: true })

      if (fetchError) {
        console.error('Error fetching existing items:', fetchError)
        throw fetchError
      }

      // If there are existing items, update the first one
      // If no items exist, create a new one
      if (existingItems && existingItems.length > 0) {
        const { error: updateError } = await supabase
          .from('canvas_items')
          .update({
            content: { text: content.trim() },
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItems[0].id)

        if (updateError) {
          console.error('Error updating canvas item:', updateError)
          throw new Error('Failed to update canvas item')
        }

        // Delete any additional text items if they exist
        if (existingItems.length > 1) {
          const itemsToDelete = existingItems.slice(1).map(item => item.id)
          const { error: deleteError } = await supabase
            .from('canvas_items')
            .delete()
            .in('id', itemsToDelete)

          if (deleteError) {
            console.error('Error cleaning up additional items:', deleteError)
          }
        }
      } else {
        // Create new item if none exists
        const { error: createError } = await supabase
          .from('canvas_items')
          .insert({
            project_id: projectId,
            type: 'text',
            content: { text: content.trim() },
            position: { x: 0, y: 0 },
            created_by: user.user.id,
          })

        if (createError) {
          console.error('Error creating canvas item:', createError)
          throw new Error('Failed to create canvas item')
        }
      }

      console.log('Document updated successfully')
      
      // Update the local state
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

  setIsEditing: (isEditing: boolean) => set({ isEditing }),
}))

export default useResearchStore 