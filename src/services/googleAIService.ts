import { Model } from '../types/models';

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

interface ModelResponse {
  models: Model[];
}

export async function fetchModels(): Promise<Model[]> {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('Google AI API key not found in environment variables');
    }

    const response = await fetch(`${BASE_URL}/models?key=${apiKey}`);
    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }

    const data: ModelResponse = await response.json();
    return data.models;
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
}

export function formatModelName(name: string): string {
  // Convert "models/gemini-pro" to "gemini-pro"
  return name.replace('models/', '');
}

export default {
  fetchModels,
  formatModelName,
}; 