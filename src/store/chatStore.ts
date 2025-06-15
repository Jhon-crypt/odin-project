import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'
import type { ChatMessage } from '../types/database'

interface ChatStore {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  fetchMessages: (projectId: string) => Promise<void>;
  sendMessage: (projectId: string, content: string) => Promise<void>;
}

const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  fetchMessages: async (projectId: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      set({ messages: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (projectId: string, content: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Insert user message
      const { error: userMsgError } = await supabase
        .from('chat_messages')
        .insert({
          project_id: projectId,
          content,
          role: 'user',
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (userMsgError) throw userMsgError;

      // Simulate AI response (replace with actual AI integration later)
      const aiResponse = "I understand your research question. Let me help analyze that...";
      
      const { error: aiMsgError } = await supabase
        .from('chat_messages')
        .insert({
          project_id: projectId,
          content: aiResponse,
          role: 'assistant',
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (aiMsgError) throw aiMsgError;

      // Fetch updated messages
      await get().fetchMessages(projectId);
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useChatStore; 