import { useState, useEffect, useRef } from 'react'
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
  Avatar,
  Button,
  Input,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ImageIcon from '@mui/icons-material/Image'
import { useParams } from 'react-router-dom'
import useChatStore from '../store/chatStore'
import useCanvasStore from '../store/canvasStore'
import useAuth from '../hooks/useAuth'

function ChatArea() {
  const { id: projectId } = useParams()
  const [input, setInput] = useState('')
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [canvasStates, setCanvasStates] = useState<Record<string, string>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  
  const {
    messages,
    isLoading: isChatLoading,
    error: chatError,
    fetchMessages,
    sendMessage,
  } = useChatStore()

  const {
    isLoading: isCanvasLoading,
    addItem,
    removeItem,
    isItemInCanvas,
  } = useCanvasStore()

  useEffect(() => {
    if (projectId) {
      fetchMessages(projectId)
    }
  }, [projectId, fetchMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Check canvas state for each AI message
  useEffect(() => {
    const checkCanvasStates = async () => {
      const states: Record<string, string> = {};
      for (const message of messages) {
        if (message.role === 'assistant' && projectId) {
          const itemId = await isItemInCanvas(message.content, projectId);
          if (itemId) {
            states[message.id] = itemId;
          }
        }
      }
      setCanvasStates(states);
    };
    
    checkCanvasStates();
  }, [messages, projectId, isItemInCanvas]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedImages(prev => [...prev, ...files])
  }

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSend = async () => {
    if ((!input.trim() && selectedImages.length === 0) || !projectId) return
    
    const message = input
    setInput('')
    const imagesToSend = [...selectedImages]
    setSelectedImages([])
    await sendMessage(projectId, message, imagesToSend)
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )
    setSelectedImages(prev => [...prev, ...files])
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleCanvasAction = async (messageId: string, content: string) => {
    if (!projectId) return;
    
    if (canvasStates[messageId]) {
      // Remove from canvas
      await removeItem(canvasStates[messageId]);
      setCanvasStates(prev => {
        const next = { ...prev };
        delete next[messageId];
        return next;
      });
    } else {
      // Add to canvas
      const itemId = await addItem(projectId, content, 'text');
      if (itemId) {
        setCanvasStates(prev => ({
          ...prev,
          [messageId]: itemId
        }));
      }
    }
  };

  if (!projectId) return null

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#1a1a1a',
      }}
    >
      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'flex-start',
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
            }}
          >
            {message.role === 'assistant' && (
              <Avatar 
                sx={{ 
                  bgcolor: '#C0FF92',
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                }}
              >
                <SmartToyIcon sx={{ color: '#1a1a1a', fontSize: { xs: 18, sm: 20 } }} />
              </Avatar>
            )}
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Paper
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  bgcolor: message.role === 'user' ? '#C0FF92' : '#333',
                  color: message.role === 'user' ? '#1a1a1a' : '#fff',
                  borderRadius: 2,
                }}
              >
                <Typography 
                  sx={{ 
                    fontSize: { xs: '14px', sm: '15px' },
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {message.content}
                </Typography>
                {message.images && message.images.length > 0 && (
                  <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {message.images.map((image, index) => (
                      <Box
                        key={index}
                        component="img"
                        src={image}
                        alt={`Uploaded image ${index + 1}`}
                        sx={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          borderRadius: 1,
                          objectFit: 'contain',
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Paper>

              {message.role === 'assistant' && (
                <Button
                  className="message-actions"
                  startIcon={canvasStates[message.id] ? <RemoveIcon /> : <AddIcon />}
                  size="small"
                  onClick={() => handleCanvasAction(message.id, message.content)}
                  disabled={isCanvasLoading}
                  sx={{
                    alignSelf: 'flex-start',
                    color: canvasStates[message.id] ? '#ff4444' : '#C0FF92',
                    borderColor: canvasStates[message.id] ? '#ff4444' : '#C0FF92',
                    fontSize: '12px',
                    py: 0.5,
                    opacity: 0,
                    transition: 'opacity 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: canvasStates[message.id] ? '#ff6666' : '#d4ffb3',
                      bgcolor: 'rgba(255, 68, 68, 0.1)',
                    },
                  }}
                  variant="outlined"
                >
                  {canvasStates[message.id] ? 'Remove from Canvas' : 'Add to Canvas'}
                </Button>
              )}
            </Box>

            {message.role === 'user' && user && (
              <Avatar 
                sx={{ 
                  bgcolor: '#C0FF92',
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                }}
              >
                {user.email?.[0].toUpperCase() || 'U'}
              </Avatar>
            )}
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          borderTop: '1px solid #333',
          bgcolor: '#1a1a1a',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxWidth: '800px',
            mx: 'auto',
          }}
        >
          {selectedImages.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedImages.map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'relative',
                    '&:hover .remove-button': {
                      opacity: 1,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={URL.createObjectURL(image)}
                    alt={`Selected image ${index + 1}`}
                    sx={{
                      width: '100px',
                      height: '100px',
                      borderRadius: 1,
                      objectFit: 'cover',
                    }}
                  />
                  <IconButton
                    className="remove-button"
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      bgcolor: '#ff4444',
                      color: '#fff',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      '&:hover': {
                        bgcolor: '#ff6666',
                      },
                    }}
                  >
                    <RemoveIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              alignItems: 'flex-end',
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Input
              type="file"
              inputRef={fileInputRef}
              sx={{ display: 'none' }}
              inputProps={{
                multiple: true,
                accept: 'image/*',
              }}
              onChange={handleImageSelect}
            />
            <IconButton
              onClick={() => fileInputRef.current?.click()}
              sx={{
                bgcolor: '#333',
                color: '#C0FF92',
                '&:hover': {
                  bgcolor: '#444',
                },
              }}
            >
              <ImageIcon />
            </IconButton>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your research question..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#262626',
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#444',
                    borderWidth: '1px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#555',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#C0FF92',
                    borderWidth: '1px',
                  },
                  '& textarea': {
                    fontSize: { xs: '14px', sm: '15px' },
                    lineHeight: 1.5,
                    p: { xs: 1.5, sm: 2 },
                  },
                },
              }}
            />
            <IconButton
              onClick={handleSend}
              disabled={isChatLoading || (!input.trim() && selectedImages.length === 0)}
              sx={{
                bgcolor: '#C0FF92',
                width: { xs: 40, sm: 44 },
                height: { xs: 40, sm: 44 },
                color: '#1a1a1a',
                '&:hover': {
                  bgcolor: '#a8e679',
                },
                '&.Mui-disabled': {
                  bgcolor: '#333',
                  color: '#666',
                },
              }}
            >
              {isChatLoading ? (
                <CircularProgress size={24} sx={{ color: '#1a1a1a' }} />
              ) : (
                <SendIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
              )}
            </IconButton>
          </Box>
        </Box>
        {chatError && (
          <Typography
            color="error"
            variant="caption"
            sx={{ 
              mt: 1.5, 
              display: 'block',
              textAlign: 'center',
              fontSize: '12px',
            }}
          >
            {chatError}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default ChatArea 