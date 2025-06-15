import type { Model } from '../types/models.js';

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

interface ModelResponse {
  models: Model[];
}

interface GoogleAIErrorOptions {
  message: string;
  cause?: unknown;
}

interface ExtendedError extends Error {
  cause?: unknown;
}

function createGoogleAIError({ message, cause }: GoogleAIErrorOptions): ExtendedError {
  const error: ExtendedError = new Error(message);
  error.name = 'GoogleAIError';
  if (cause) {
    error.cause = cause;
  }
  return error;
}

export async function fetchModels(): Promise<Model[]> {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw createGoogleAIError({
        message: 'Google AI API key not found in environment variables'
      });
    }

    const response = await fetch(`${BASE_URL}/models?key=${apiKey}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw createGoogleAIError({
        message: `Failed to fetch models: ${response.status} ${response.statusText}`,
        cause: errorData
      });
    }

    const data = await response.json();
    if (!isModelResponse(data)) {
      throw createGoogleAIError({
        message: 'Invalid response format from Google AI API'
      });
    }

    return data.models;
  } catch (error) {
    if (error instanceof Error && error.name === 'GoogleAIError') {
      throw error;
    }
    console.error('Error fetching models:', error);
    throw createGoogleAIError({
      message: 'Failed to fetch models',
      cause: error
    });
  }
}

function isModelResponse(data: unknown): data is ModelResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'models' in data &&
    Array.isArray((data as ModelResponse).models)
  );
}

export function formatModelName(name: string): string {
  // Convert "models/gemini-pro" to "gemini-pro"
  return name.replace('models/', '');
}

const googleAIService = {
  fetchModels,
  formatModelName,
};

export default googleAIService; 