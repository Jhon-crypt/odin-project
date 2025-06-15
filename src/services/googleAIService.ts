interface GoogleAIModel {
  name: string;
  version: string;
  displayName: string;
  description: string;
  inputTokenLimit: number;
  outputTokenLimit: number;
  supportedGenerationMethods: string[];
  temperature: number;
  topP: number;
  topK: number;
}

interface GoogleAIModelsResponse {
  models: GoogleAIModel[];
}

const GOOGLE_AI_API_KEY = 'AIzaSyAYfYRdSiq1GIWSHNXzZR-XiXMivOE3hf0';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

export async function fetchGoogleAIModels(): Promise<GoogleAIModel[]> {
  try {
    const response = await fetch(`${BASE_URL}/models?key=${GOOGLE_AI_API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: GoogleAIModelsResponse = await response.json();
    return data.models;
  } catch (error) {
    console.error('Error fetching Google AI models:', error);
    throw error;
  }
}

export function formatModelName(name: string): string {
  // Convert "models/gemini-pro" to "gemini-pro"
  return name.replace('models/', '');
}

export default {
  fetchGoogleAIModels,
  formatModelName,
}; 