export interface Project {
  id: string;
  created_at: string;
  name: string;
  created_by: string;
}

export interface ChatMessage {
  id: string;
  project_id: string;
  user_id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
  updated_at: string;
  images?: string[];
}

export interface TextContent {
  text: string;
  fontSize?: number;
  color?: string;
}

export interface ImageContent {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface LinkContent {
  url: string;
  title: string;
  description?: string;
}

export interface FileContent {
  url: string;
  name: string;
  size: number;
  type: string;
}

export interface NoteContent {
  text: string;
  color?: string;
}

type CanvasItemContent = {
  text: TextContent;
  image: ImageContent;
  link: LinkContent;
  file: FileContent;
  note: NoteContent;
}

export interface CanvasItem {
  id: string;
  project_id: string;
  type: keyof CanvasItemContent;
  content: CanvasItemContent[keyof CanvasItemContent];
  position: {
    x: number;
    y: number;
  };
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at'>;
        Update: Partial<Omit<Project, 'id' | 'created_at'>>;
      };
      chat_messages: {
        Row: ChatMessage;
        Insert: Omit<ChatMessage, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ChatMessage, 'id' | 'created_at' | 'updated_at'>>;
      };
      canvas_items: {
        Row: CanvasItem;
        Insert: Omit<CanvasItem, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CanvasItem, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
} 