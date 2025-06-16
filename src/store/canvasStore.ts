import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'
import type { CanvasItem, TextContent } from '../types/database'

export interface CanvasStore {
  items: CanvasItem[]
  isLoading: boolean
  error: string | null
  fetchItems: (projectId: string) => Promise<void>
  addItem: (content: string, projectId: string) => Promise<string>
  removeItem: (itemId: string, projectId: string) => Promise<void>
  updateItem: (itemId: string, content: string, projectId: string) => Promise<void>
  isItemInCanvas: (content: string, projectId: string) => Promise<string | null>
  clearCanvas: () => void
}

const useCanvasStore = create<CanvasStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async (projectId: string) => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('canvas_items')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

      if (error) throw error
      set({ items: data || [], isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  addItem: async (content: string, projectId: string) => {
    set({ isLoading: true, error: null })
    try {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) throw new Error('User not authenticated')

      // Calculate a reasonable position for the new item
      const items = get().items
      const position = {
        x: (items.length * 50) % 800, // Spread items horizontally, wrap at 800px
        y: Math.floor(items.length / 16) * 50, // Move to next row every 16 items
      }

      const { data, error } = await supabase
        .from('canvas_items')
        .insert({
          project_id: projectId,
          type: 'text',
          content: { text: content },
          position,
          created_by: user.id,
        })
        .select()
        .single()

      if (error) throw error

      // Update local state immediately
      set(state => ({
        items: [...state.items, data],
        isLoading: false,
        error: null
      }))

      return data.id
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  removeItem: async (itemId: string, projectId: string) => {
    // Update state immediately for responsive UI
    const currentItems = get().items
    set(state => ({
      items: state.items.filter(item => item.id !== itemId),
      isLoading: true,
      error: null
    }))

    try {
      const { error } = await supabase
        .from('canvas_items')
        .delete()
        .eq('id', itemId)
        .eq('project_id', projectId)

      if (error) {
        // Revert state if deletion fails
        set(state => ({
          items: currentItems,
          isLoading: false,
          error: 'Failed to remove item from canvas'
        }))
        throw error
      }

      set({ isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  updateItem: async (itemId: string, content: string, projectId: string) => {
    set({ isLoading: true, error: null })
    try {
      const { error } = await supabase
        .from('canvas_items')
        .update({ content: { text: content } })
        .eq('id', itemId)
        .eq('project_id', projectId)

      if (error) throw error

      // Update local state
      set(state => ({
        items: state.items.map(item =>
          item.id === itemId
            ? { ...item, content: { text: content } as TextContent }
            : item
        ),
        isLoading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  isItemInCanvas: async (content: string, projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('canvas_items')
        .select('id')
        .eq('project_id', projectId)
        .eq('content->>text', content)
        .single()

      if (error) return null
      return data.id
    } catch {
      return null
    }
  },

  clearCanvas: () => {
    set({ items: [], error: null })
  },
}))

export default useCanvasStore 