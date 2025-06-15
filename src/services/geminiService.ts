import { supabase } from '../lib/supabaseClient'

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    }
  }>
}

export async function generateContent(modelName: string, apiKey: string, content: string, imageUrls: string[] = []) {
  try {
    const { data, error } = await supabase.functions.invoke('gemini-proxy', {
      body: {
        modelName,
        apiKey,
        contents: [
          {
            role: 'user',
            parts: [
              { text: content },
              ...(imageUrls.map(url => ({ image_url: url })))
            ]
          }
        ]
      }
    })

    if (error) throw error
    if (!data) throw new Error('No response from Gemini API')

    return data as GeminiResponse
  } catch (error) {
    console.error('Error calling Gemini API:', error)
    throw error
  }
} 