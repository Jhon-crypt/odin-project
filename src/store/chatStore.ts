import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'
import type { ChatMessage } from '../types/database'
import useLLMStore from './llmStore'

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
        throw new Error('No model or API key configured');
      }

      // Call Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: SYSTEM_PROMPT }
              ]
            },
            {
              role: 'model',
              parts: [
                { text: 'I understand and will act as an advanced research AI assistant.' }
              ]
            },
            {
              role: 'user',
              parts: [
                { text: content },
                ...(imageUrls.map(url => ({ image_url: url })))
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const aiResponseData = await response.json();
      const aiResponse = aiResponseData.candidates[0].content.parts[0].text;
      
      // Insert AI response
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