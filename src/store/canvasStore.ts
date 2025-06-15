import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'
import type { CanvasItem } from '../types/database'

interface CanvasStore {
  items: CanvasItem[];
  isLoading: boolean;
  error: string | null;
  fetchItems: (projectId: string) => Promise<void>;
  addItem: (projectId: string, content: string, type: 'text' | 'note') => Promise<string>;
  removeItem: (itemId: string) => Promise<void>;
  isItemInCanvas: (content: string, projectId: string) => Promise<string | null>;
}

const useCanvasStore = create<CanvasStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async (projectId: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('canvas_items')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      set({ items: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (projectId: string, content: string, type: 'text' | 'note') => {
    try {
      set({ isLoading: true, error: null });
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      // Calculate a reasonable position for the new item
      const items = get().items;
      const position = {
        x: (items.length * 50) % 800, // Spread items horizontally, wrap at 800px
        y: Math.floor(items.length / 16) * 50, // Move to next row every 16 items
      };

      const { data, error } = await supabase
        .from('canvas_items')
        .insert({
          project_id: projectId,
          type,
          content: { text: content },
          position,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      await get().fetchItems(projectId);
      return data.id;
    } catch (error) {
      set({ error: (error as Error).message });
      return '';
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (itemId: string) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase
        .from('canvas_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      set(state => ({
        items: state.items.filter(item => item.id !== itemId)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  isItemInCanvas: async (content: string, projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('canvas_items')
        .select('id')
        .eq('project_id', projectId)
        .eq('content->>text', content)
        .single();

      if (error) return null;
      return data.id;
    } catch {
      return null;
    }
  },
}));

export default useCanvasStore; 