import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
  Avatar,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import ImageIcon from '@mui/icons-material/Image'
import { useParams } from 'react-router-dom'
import useChatStore from '../store/chatStore'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CloseIcon from '@mui/icons-material/Close'

interface MessageProps {
  message: {
    id: string;
    content: string;
    created_at: string;
    role: 'user' | 'assistant';
  };
  isUser: boolean;
  isStreaming: boolean;
}

// Memoized Message Component for better performance
const MessageComponent = React.memo(({ message, isUser, isStreaming }: MessageProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        maxWidth: '80%',
        width: 'auto',
        mb: 2,
        position: 'relative',
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
    >
      <Avatar
        sx={{
          bgcolor: isUser ? '#666' : '#C0FF92',
          width: { xs: 32, sm: 36 },
          height: { xs: 32, sm: 36 },
          mx: 1,
          color: isUser ? '#fff' : '#000'
        }}
      >
        {isUser ? 'U' : <SmartToyIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />}
      </Avatar>
      
      <Paper
        elevation={1}
        sx={{
          p: 2,
          bgcolor: isUser ? '#C0FF92' : '#2a2a2a',
          color: isUser ? '#000' : '#fff',
          borderRadius: 2,
          maxWidth: '100%',
          wordBreak: 'break-word',
          // Optimize for smooth streaming
          willChange: isStreaming ? 'contents' : 'auto',
          transform: 'translateZ(0)', // Force hardware acceleration
        }}
      >
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => (
              <Typography 
                component="div" 
                variant="body2" 
                sx={{ 
                  mb: 1, 
                  '&:last-child': { mb: 0 },
                  lineHeight: 1.6,
                  // Optimize text rendering for streaming
                  textRendering: 'optimizeSpeed',
                }}
              >
                {children}
              </Typography>
            ),
          }}
        >
          {message.content || ''}
        </ReactMarkdown>
        
        {/* Message timestamp */}
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 1,
            opacity: 0.7,
            fontSize: '0.75rem',
            textAlign: isUser ? 'right' : 'left',
          }}
        >
          {format(new Date(message.created_at), 'HH:mm')}
        </Typography>
      </Paper>
    </Box>
  );
});

function ChatArea() {
  const { id: projectId } = useParams()
  const [input, setInput] = useState('')
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const lastMessageRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const {
    messages,
    isLoading: isChatLoading,
    error: chatError,
    fetchMessages,
    sendMessage,
    streamingMessageId,
    streamingContent,
  } = useChatStore()

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, streamingContent])

  // Fetch messages when project changes
  useEffect(() => {
    if (projectId) {
      fetchMessages(projectId)
    }
  }, [projectId, fetchMessages])

  const handleSend = useCallback(async () => {
    if (!projectId || (!input.trim() && selectedImages.length === 0)) return
    
    const messageContent = input.trim()
    const imagesToSend = [...selectedImages]
    
    // Clear input immediately for better UX
    setInput('')
    setSelectedImages([])
    
    try {
      await sendMessage(projectId, messageContent, imagesToSend)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }, [projectId, input, selectedImages, sendMessage])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedImages(prev => [...prev, ...files])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const removeImage = useCallback((index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }, [])

  if (!projectId) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Please select a project to start chatting
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Messages Area */}
      <Box
        ref={chatContainerRef}
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          mb: 2,
          alignItems: 'stretch', // Allow full width for proper message alignment
        }}
      >
        {chatError ? (
          <Box sx={{ textAlign: 'center', color: 'error.main', p: 4 }}>
            {chatError}
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            gap: 2,
            color: 'text.secondary',
            p: 4
          }}>
            <Typography variant="h6">
              Start Your Research Chat
            </Typography>
            <Typography>
              Ask questions, share ideas, or upload images to begin your research.
              Interesting findings can be added to your research canvas for easy reference.
            </Typography>
          </Box>
        ) : (
          <>
            {messages.map((message, index) => (
              <Box
                key={message.id}
                ref={index === messages.length - 1 ? lastMessageRef : null}
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <MessageComponent
                  message={message}
                  isUser={message.role === 'user'}
                  isStreaming={message.id === streamingMessageId}
                />
              </Box>
            ))}
            
            {/* Show typing indicator when AI is responding and no streaming content yet */}
            {isChatLoading && messages.length > 0 && !streamingMessageId && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  alignSelf: 'flex-start',
                  maxWidth: '80%',
                  width: 'auto',
                  mb: 2
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: '#C0FF92',
                    width: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 },
                    mr: 1,
                    color: '#000'
                  }}
                >
                  <SmartToyIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                </Avatar>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    bgcolor: '#2a2a2a',
                    borderRadius: 2,
                    maxWidth: '100%'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} sx={{ color: '#C0FF92' }} />
                    <Typography variant="body2" sx={{ color: '#ccc' }}>
                      AI is thinking...
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Input Area */}
      <Box sx={{ position: 'sticky', bottom: 0, bgcolor: 'background.paper', pt: 2 }}>
        {/* Selected Images Preview */}
        {selectedImages.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {selectedImages.map((image, index) => (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  width: 100,
                  height: 100,
                }}
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Selected ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 8,
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => removeImage(index)}
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    bgcolor: 'error.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'error.dark',
                    },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        {/* Input Field */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isChatLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
              },
            }}
          />
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />
          
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            disabled={isChatLoading}
            sx={{
              bgcolor: 'background.default',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ImageIcon />
          </IconButton>
          
          <IconButton
            onClick={handleSend}
            disabled={isChatLoading || (!input.trim() && selectedImages.length === 0)}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '&.Mui-disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'action.disabled',
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

export default ChatArea
