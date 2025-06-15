-- Enable storage extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "storage" SCHEMA extensions;

-- Create bucket for chat images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('chat-images', 'chat-images', true);

-- Storage policies for chat images
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-images');

CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Allow users to delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'chat-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Update chat_messages table to include images
ALTER TABLE chat_messages
ADD COLUMN images TEXT[] DEFAULT NULL; 