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
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useParams } from 'react-router-dom'
import useChatStore from '../store/chatStore'
import useCanvasStore from '../store/canvasStore'
import useAuth from '../hooks/useAuth'

function ChatArea() {
  const { id: projectId } = useParams()
  const [input, setInput] = useState('')
  const [canvasStates, setCanvasStates] = useState<Record<string, string>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
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

  const handleSend = async () => {
    if (!input.trim() || !projectId) return
    
    const message = input
    setInput('')
    await sendMessage(projectId, message)
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
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
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
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
              maxWidth: '80%',
            }}
          >
            {message.role === 'assistant' && (
              <Avatar sx={{ bgcolor: '#C0FF92' }}>
                <SmartToyIcon sx={{ color: '#1a1a1a' }} />
              </Avatar>
            )}
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: message.role === 'user' ? '#C0FF92' : '#333',
                  color: message.role === 'user' ? '#1a1a1a' : '#fff',
                  borderRadius: 2,
                }}
              >
                <Typography>{message.content}</Typography>
              </Paper>

              {message.role === 'assistant' && (
                <Button
                  startIcon={canvasStates[message.id] ? <RemoveIcon /> : <AddIcon />}
                  size="small"
                  onClick={() => handleCanvasAction(message.id, message.content)}
                  disabled={isCanvasLoading}
                  sx={{
                    alignSelf: 'flex-start',
                    color: canvasStates[message.id] ? '#ff4444' : '#C0FF92',
                    borderColor: canvasStates[message.id] ? '#ff4444' : '#C0FF92',
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
              <Avatar sx={{ bgcolor: '#C0FF92' }}>
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
          p: 2,
          borderTop: '1px solid #333',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
          }}
        >
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
                bgcolor: '#333',
                '& fieldset': {
                  borderColor: '#444',
                },
                '&:hover fieldset': {
                  borderColor: '#555',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#C0FF92',
                },
              },
            }}
          />
          <IconButton
            onClick={handleSend}
            disabled={isChatLoading || !input.trim()}
            sx={{
              bgcolor: '#C0FF92',
              color: '#1a1a1a',
              '&:hover': {
                bgcolor: '#a8e679',
              },
              '&.Mui-disabled': {
                bgcolor: '#444',
                color: '#666',
              },
            }}
          >
            {isChatLoading ? (
              <CircularProgress size={24} sx={{ color: '#1a1a1a' }} />
            ) : (
              <SendIcon />
            )}
          </IconButton>
        </Box>
        {chatError && (
          <Typography
            color="error"
            variant="caption"
            sx={{ mt: 1, display: 'block' }}
          >
            {chatError}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default ChatArea 