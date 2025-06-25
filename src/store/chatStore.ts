import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
  images?: string[]
  type?: 'text' | 'image'
}

interface ChatStore {
  messages: Message[]
  isLoading: boolean
  error: string | null
  streamingMessageId: string | null
  streamingContent: string
  fetchMessages: (projectId: string) => Promise<void>
  sendMessage: (projectId: string, content: string, images?: File[]) => Promise<void>
  deleteMessage: (messageId: string) => Promise<void>
  updateStreamingMessage: (content: string) => void
  setStreamingMessageId: (id: string | null) => void
}

const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  streamingMessageId: null,
  streamingContent: '',

  fetchMessages: async (projectId: string) => {
    try {
      set({ isLoading: true, error: null })
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

      if (error) throw error
      set({ messages: data || [] })
    } catch (error) {
      set({ error: (error as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },

  sendMessage: async (projectId: string, content: string, images: File[] = []) => {
    try {
      // First add the user's message
      const userMessageId = uuidv4()
      const userMessage: Message = {
        id: userMessageId,
        role: 'user',
        content,
        created_at: new Date().toISOString(),
      }

      // If there are images, upload them first
      if (images.length > 0) {
        const uploadedUrls = []
        for (const image of images) {
          const fileExt = image.name.split('.').pop()
          const fileName = `${uuidv4()}.${fileExt}`
          const { error } = await supabase.storage
            .from('chat-images')
            .upload(fileName, image)

          if (error) throw error
          const { data: { publicUrl } } = supabase.storage
            .from('chat-images')
            .getPublicUrl(fileName)
          uploadedUrls.push(publicUrl)
        }
        userMessage.images = uploadedUrls
      }

      // Add user message to the database
      const { error: userMsgError } = await supabase
        .from('messages')
        .insert([{ ...userMessage, project_id: projectId }])

      if (userMsgError) throw userMsgError

      // Create a placeholder for the AI response
      const aiMessageId = uuidv4()
      const aiMessage: Message = {
        id: aiMessageId,
        role: 'assistant',
        content: '',
        created_at: new Date().toISOString(),
      }

      // Update local state with both messages
      set(state => ({
        messages: [...state.messages, userMessage, aiMessage],
        streamingMessageId: aiMessageId,
        streamingContent: ''
      }))

      // Start streaming the AI response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, projectId }),
      })

      if (!response.ok) throw new Error('Failed to get AI response')
      
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response reader available')

      let accumulatedContent = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Decode and accumulate the streamed content
        const chunk = new TextDecoder().decode(value)
        accumulatedContent += chunk
        set({ streamingContent: accumulatedContent })
      }

      // Once streaming is complete, save the full message to the database
      const { error: aiMsgError } = await supabase
        .from('messages')
        .insert([{
          ...aiMessage,
          content: accumulatedContent,
          project_id: projectId
        }])

      if (aiMsgError) throw aiMsgError

      // Update final message in local state
      set(state => ({
        messages: state.messages.map(msg =>
          msg.id === aiMessageId
            ? { ...msg, content: accumulatedContent }
            : msg
        ),
        streamingMessageId: null,
        streamingContent: ''
      }))

    } catch (error) {
      set({ error: (error as Error).message })
      // Remove the failed message from local state
      set(state => ({
        messages: state.messages.filter(msg => msg.id !== get().streamingMessageId),
        streamingMessageId: null,
        streamingContent: ''
      }))
    }
  },

  deleteMessage: async (messageId: string) => {
    try {
      set({ isLoading: true, error: null })
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)

      if (error) throw error

      set(state => ({
        messages: state.messages.filter(msg => msg.id !== messageId)
      }))
    } catch (error) {
      set({ error: (error as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },

  updateStreamingMessage: (content: string) => {
    set({ streamingContent: content })
  },

  setStreamingMessageId: (id: string | null) => {
    set({ streamingMessageId: id })
  }
}))

export default useChatStore 