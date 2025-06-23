import type { Database } from './database'

export type CanvasItem = Database['public']['Tables']['canvas_items']['Row']

export interface TextContent {
  text: string
}

export interface Model {
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