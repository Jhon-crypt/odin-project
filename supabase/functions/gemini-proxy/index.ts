import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

interface RequestBody {
  modelName: string
  apiKey: string
  contents: Array<{
    role: string
    parts: Array<{
      text?: string
      image_url?: string
    }>
  }>
}

serve(async (req) => {
  try {
    // Parse request body
    const { modelName, apiKey, contents } = await req.json() as RequestBody

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({ contents }),
      }
    )

    // Get response data
    const data = await response.json()

    // Return response with CORS headers
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-goog-api-key',
      },
    })
  } catch (error) {
    // Return error response
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
}) 