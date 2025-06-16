import { create } from 'zustand'
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

const useCanvasStore = create<CanvasStore>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async (projectId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/projects/${projectId}/canvas`)
      if (!response.ok) throw new Error('Failed to fetch canvas items')
      const items = await response.json()
      set({ items, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  addItem: async (content: string, projectId: string) => {
    set({ isLoading: true, error: null })
    try {
      const newItem: Partial<CanvasItem> = {
        project_id: projectId,
        type: 'text',
        content: { text: content } as TextContent,
        position: { x: 0, y: 0 },
        created_by: 'user', // This should be replaced with actual user ID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const response = await fetch(`/api/projects/${projectId}/canvas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      })
      if (!response.ok) throw new Error('Failed to add item to canvas')
      const { id } = await response.json()
      
      const fullItem: CanvasItem = { id, ...newItem } as CanvasItem
      set((state) => ({
        items: [...state.items, fullItem],
        isLoading: false,
      }))
      return id
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  removeItem: async (itemId: string, projectId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/projects/${projectId}/canvas/${itemId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to remove item from canvas')
      set((state) => ({
        items: state.items.filter((item) => item.id !== itemId),
        isLoading: false,
      }))
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  updateItem: async (itemId: string, content: string, projectId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/projects/${projectId}/canvas/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: { text: content } }),
      })
      if (!response.ok) throw new Error('Failed to update canvas item')
      set((state) => ({
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, content: { text: content } as TextContent } : item
        ),
        isLoading: false,
      }))
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  isItemInCanvas: async (content: string, projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/canvas/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (!response.ok) throw new Error('Failed to check canvas item')
      const { id } = await response.json()
      return id || null
    } catch (error) {
      console.error('Error checking canvas item:', error)
      return null
    }
  },

  clearCanvas: () => {
    set({ items: [], error: null })
  },
}))

export default useCanvasStore 