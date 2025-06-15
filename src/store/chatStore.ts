import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'
import type { ChatMessage } from '../types/database'
import useLLMStore from './llmStore'
import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_PROMPT = `You are now an advanced, autonomous AI tasked with conducting deep and thorough research on any information provided to you. Your objective is to analyze, investigate, and synthesize data from a vast array of sources to produce a comprehensive, detailed, and insightful response.

Key Instructions:

    Research Execution:
        Thoroughness: Ensure you explore every facet of the given information, both directly and indirectly related. Use authoritative and up-to-date sources, ensuring the analysis covers both primary and secondary angles.
        Accuracy: Gather and cross-check data from trusted, credible sources. Pay special attention to any discrepancies in data or conflicting information, and address them clearly.
        Contextual Understanding: Ensure that your research is grounded in the relevant context of the topic, including historical, cultural, technical, and scientific perspectives, as needed.

    Analysis:
        Deep Dive: Go beyond surface-level research. Provide deep insights into the origins, implications, and potential applications of the information. Explore nuances, assumptions, and connections with broader fields.
        Interdisciplinary Approach: Draw from various disciplines as needed. For example, when researching technical topics, integrate insights from business, philosophy, history, or any other relevant domains to provide a holistic view.
        Future Implications: Consider future trends, projections, and potential consequences of the research topic. Highlight areas that require further investigation or evolving approaches.

    Comprehensiveness:
        Multiform Information: If the given input involves different types of information (text, data, diagrams, etc.), interpret all forms carefully. For instance, convert any textual data into structured insights, process visual data or code, and blend them together into a comprehensive understanding.
        Patterns and Correlations: Identify patterns, trends, and correlations within the information. Look for hidden connections, emerging patterns, or anomalies that could offer new insights.
        Concise, Yet Detailed: While being detailed, ensure the response is concise and easy to follow. Avoid overwhelming the reader, but make sure no important aspect is left out.

    Sourcing and Citations:
        References: When presenting conclusions, insights, or facts, back up your findings with citations from reliable sources or references. If a source is unavailable, note that you've explored all known available resources.
        Peer-Reviewed Journals and Databases: Always prioritize peer-reviewed sources, scientific journals, and authoritative publications when possible.

    Delivery of Output:
        Structured and Organized: Organize the research into logical sections or subsections. Ensure the output is easy to follow, with clear headings, bullet points, or numbered lists when necessary.
        Professional Tone: Maintain a scholarly, neutral tone, but ensure the presentation is engaging and thought-provoking. Avoid overly technical jargon unless it is necessary to maintain the depth of the research.`

interface ChatStore {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  fetchMessages: (projectId: string) => Promise<void>;
  sendMessage: (projectId: string, content: string, images?: File[]) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
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
      
      // Clear existing messages and set new ones
      set({ messages: data || [] });
    } catch (error) {
      console.error('Error fetching messages:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (projectId: string, content: string, images?: File[]) => {
    try {
      set({ isLoading: true, error: null });
      
      // Upload images if any
      const imageUrls: string[] = [];
      if (images && images.length > 0) {
        for (const image of images) {
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('chat-images')
            .upload(`${projectId}/${Date.now()}-${image.name}`, image);

          if (uploadError) throw uploadError;
          if (uploadData) {
            const { data: { publicUrl } } = supabase.storage
              .from('chat-images')
              .getPublicUrl(uploadData.path);
            imageUrls.push(publicUrl);
          }
        }
      }

      // Insert user message
      const { error: userMsgError } = await supabase
        .from('chat_messages')
        .insert({
          project_id: projectId,
          content,
          role: 'user',
          user_id: (await supabase.auth.getUser()).data.user?.id,
          images: imageUrls.length > 0 ? imageUrls : null
        });

      if (userMsgError) throw userMsgError;

      // Get the selected model and API key
      const { selectedLLM: modelName, apiKey } = useLLMStore.getState();
      if (!modelName || !apiKey) {
        throw new Error('Please configure your LLM settings first');
      }

      // Initialize Google AI
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: modelName });

      // Start a chat
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: SYSTEM_PROMPT }],
          },
          {
            role: "model",
            parts: [{ text: "I understand and will act as an advanced research AI assistant." }],
          }
        ],
      });

      // Send message and get response
      const result = await chat.sendMessage(content);
      const aiResponse = await result.response;
      const responseText = aiResponse.text();
      
      // Insert AI response
      const { error: aiMsgError } = await supabase
        .from('chat_messages')
        .insert({
          project_id: projectId,
          content: responseText,
          role: 'assistant',
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (aiMsgError) throw aiMsgError;

      // Fetch updated messages
      await get().fetchMessages(projectId);
    } catch (error) {
      console.error('Chat error:', error);
      let errorMessage = 'An error occurred while processing your message.';
      
      if (error instanceof Error) {
        const errorStr = error.toString().toLowerCase();
        
        // Handle rate limit errors
        if (errorStr.includes('quota exceeded') || errorStr.includes('rate_limit_exceeded')) {
          errorMessage = "You've reached the API rate limit. Please wait a moment before sending another message.";
        }
        // Handle authentication errors
        else if (errorStr.includes('authentication') || errorStr.includes('api key')) {
          errorMessage = "There's an issue with your API key. Please check your LLM configuration.";
        }
        // Handle network errors
        else if (errorStr.includes('network') || errorStr.includes('fetch')) {
          errorMessage = "Unable to connect to the AI service. Please check your internet connection.";
        }
      }
      
      // Insert error message as assistant message
      try {
        await supabase
          .from('chat_messages')
          .insert({
            project_id: projectId,
            content: errorMessage,
            role: 'assistant',
            user_id: (await supabase.auth.getUser()).data.user?.id
          });
        
        // Fetch updated messages to show the error
        await get().fetchMessages(projectId);
      } catch (insertError) {
        console.error('Error inserting error message:', insertError);
      }
      
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteMessage: async (messageId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Get message details first to check for images
      const { data: message, error: fetchError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('id', messageId)
        .single();

      if (fetchError) throw fetchError;

      // Delete images from storage if they exist
      if (message?.images && message.images.length > 0) {
        for (const imageUrl of message.images) {
          const path = imageUrl.split('/').pop(); // Get filename from URL
          if (path) {
            const { error: storageError } = await supabase.storage
              .from('chat-images')
              .remove([path]);
            
            if (storageError) {
              console.error('Error deleting image:', storageError);
            }
          }
        }
      }

      // Delete message from database
      const { error: deleteError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

      if (deleteError) throw deleteError;

      // Update local state
      set(state => ({
        messages: state.messages.filter(msg => msg.id !== messageId)
      }));
    } catch (error) {
      console.error('Error deleting message:', error);
      set({ error: 'Failed to delete message. Please try again.' });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useChatStore; 