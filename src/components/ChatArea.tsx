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
  Menu,
  MenuItem,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ImageIcon from '@mui/icons-material/Image'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import { useParams } from 'react-router-dom'
import useChatStore from '../store/chatStore'
import useCanvasStore from '../store/canvasStore'
import useAuth from '../hooks/useAuth'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function ChatArea() {
  const { id: projectId } = useParams()
  const [input, setInput] = useState('')
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [canvasStates, setCanvasStates] = useState<Record<string, string>>({})
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  
  const {
    messages,
    isLoading: isChatLoading,
    error: chatError,
    fetchMessages,
    sendMessage,
    deleteMessage,
  } = useChatStore()

  const {
    addItem,
    removeItem,
    isItemInCanvas,
    items,
  } = useCanvasStore()

  // Reset states when project changes
  useEffect(() => {
    setInput('')
    setSelectedImages([])
    setCanvasStates({})
    setLoadingStates({})
    setMenuAnchorEl(null)
    setSelectedMessageId(null)
  }, [projectId])

  // Fetch messages when project changes
  useEffect(() => {
    if (projectId) {
      console.log('ChatArea: Fetching messages for project:', projectId)
      fetchMessages(projectId)
    }
  }, [projectId]) // Remove fetchMessages from dependencies

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Check canvas state for each AI message
  useEffect(() => {
    const checkCanvasStates = async () => {
      if (!projectId) return;
      
      const states: Record<string, string> = {};
      for (const message of messages) {
        if (message.role === 'assistant' && message.content) {
          const itemId = await isItemInCanvas(message.content, projectId);
          if (itemId) {
            states[message.id] = itemId;
          }
        }
      }
      setCanvasStates(states);
    };
    
    checkCanvasStates();
  }, [messages, projectId, isItemInCanvas, items]); // Add items dependency

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

  const handleAddToCanvas = async (messageId: string, messageContent: string) => {
    if (!projectId) return;
    try {
      setLoadingStates(prev => ({ ...prev, [messageId]: true }));
      const itemId = await addItem(messageContent, projectId);
      if (itemId) {
        setCanvasStates(prev => ({
          ...prev,
          [messageId]: itemId
        }));
      }
    } catch (error) {
      console.error('Failed to add item to canvas:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [messageId]: false }));
    }
  };

  const handleRemoveFromCanvas = async (messageId: string, itemId: string) => {
    if (!projectId) return;
    try {
      setLoadingStates(prev => ({ ...prev, [messageId]: true }));
      await removeItem(itemId, projectId);
      setCanvasStates(prev => {
        const newState = { ...prev };
        delete newState[messageId];
        return newState;
      });
    } catch (error) {
      console.error('Failed to remove item from canvas:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [messageId]: false }));
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, messageId: string) => {
    event.stopPropagation();
    setSelectedMessageId(messageId);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedMessageId(null);
  };

  const handleDeleteMessage = async () => {
    if (selectedMessageId) {
      await deleteMessage(selectedMessageId);
      handleMenuClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatMessageTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm')
  }

  if (!projectId) return null

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {isChatLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress sx={{ color: '#C0FF92' }} />
            </Box>
        ) : chatError ? (
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
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  width: 'auto',
                  position: 'relative',
                  '&:hover .message-actions, &:hover .message-menu': {
                    opacity: 1,
                  },
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
                
                <Box sx={{ 
                    display: 'flex',
                  flexDirection: 'column', 
                  gap: 0.5,
                  width: 'auto',
                  position: 'relative',
                }}>
                  {/* Sender Name */}
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: message.role === 'user' ? '#C0FF92' : '#888',
                      ml: message.role === 'user' ? 'auto' : 0,
                      mr: message.role === 'user' ? 1 : 0,
                    }}
                  >
                    {message.role === 'user' ? user?.email?.split('@')[0] || 'You' : 'AI Assistant'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                    <Paper
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        bgcolor: message.role === 'user' ? '#C0FF92' : '#333',
                        color: message.role === 'user' ? '#1a1a1a' : '#fff',
                        borderRadius: 2,
                        width: 'auto',
                        position: 'relative',
                        '& .markdown-content': {
                          fontSize: { xs: '14px', sm: '15px' },
                          lineHeight: 1.5,
                          '& h1, & h2, & h3, & h4, & h5, & h6': {
                            color: message.role === 'user' ? '#1a1a1a' : '#fff',
                            fontWeight: 'bold',
                            mt: 2,
                            mb: 1,
                          },
                          '& h1': { fontSize: '1.5em' },
                          '& h2': { fontSize: '1.3em' },
                          '& h3': { fontSize: '1.2em' },
                          '& h4': { fontSize: '1.1em' },
                          '& h5, & h6': { fontSize: '1em' },
                          '& p': {
                            my: 1,
                          },
                          '& ul, & ol': {
                            pl: 3,
                            my: 1,
                          },
                          '& li': {
                            mb: 0.5,
                          },
                          '& code': {
                            bgcolor: message.role === 'user' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                            p: 0.5,
                            borderRadius: 0.5,
                            fontFamily: 'monospace',
                          },
                          '& pre': {
                            bgcolor: message.role === 'user' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                            p: 1,
                            borderRadius: 1,
                            overflow: 'auto',
                            '& code': {
                              bgcolor: 'transparent',
                              p: 0,
                            },
                          },
                          '& blockquote': {
                            borderLeft: `3px solid ${message.role === 'user' ? '#1a1a1a' : '#C0FF92'}`,
                            pl: 2,
                            my: 1,
                            color: message.role === 'user' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
                          },
                          '& a': {
                            color: message.role === 'user' ? '#006600' : '#C0FF92',
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          },
                          '& img': {
                            maxWidth: '100%',
                            borderRadius: 1,
                          },
                          '& table': {
                            borderCollapse: 'collapse',
                            width: '100%',
                            my: 2,
                          },
                          '& th, & td': {
                            border: `1px solid ${message.role === 'user' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'}`,
                            p: 1,
                          },
                          '& th': {
                            bgcolor: message.role === 'user' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                          },
                          '& hr': {
                            border: 'none',
                            borderTop: `1px solid ${message.role === 'user' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'}`,
                            my: 2,
                          },
                          '& strong': {
                            color: message.role === 'user' ? '#004400' : '#d4ffb3',
                          },
                          '& em': {
                            fontStyle: 'italic',
                          },
                        },
                      }}
                    >
                      {/* Message Content */}
                      <Box className="markdown-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
              </Box>

                      {/* File Attachments */}
                      {message.images && message.images.length > 0 && (
                        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {message.images.map((image, index) => (
                            <Box
                              key={index}
                sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                p: 1,
                                bgcolor: message.role === 'user' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                                borderRadius: 1,
                }}
              >
                              <InsertDriveFileIcon sx={{ fontSize: 20 }} />
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography noWrap sx={{ fontSize: '14px' }}>
                                  {image.split('/').pop()}
                                </Typography>
                                <Typography sx={{ fontSize: '12px', color: message.role === 'user' ? 'rgba(0,0,0,0.6)' : '#888' }}>
                                  {formatFileSize(1.2 * 1024 * 1024)} {/* Example size */}
              </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}

                      {/* Message Time and Status */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                          gap: 0.5,
                          justifyContent: 'flex-end',
                          mt: 1,
                          opacity: 0.7,
                }}
              >
                        <Typography sx={{ fontSize: '12px' }}>
                          {formatMessageTime(message.created_at)}
                        </Typography>
                        {message.role === 'user' && (
                          <DoneAllIcon sx={{ fontSize: 16, color: message.role === 'user' ? '#1a1a1a' : '#C0FF92' }} />
                        )}
                      </Box>
                    </Paper>
                    
                    <IconButton
                      className="message-menu"
                      size="small"
                      onClick={(e) => handleMenuOpen(e, message.id)}
                  sx={{
                        opacity: 0,
                        transition: 'opacity 0.2s',
                    color: '#888',
                        alignSelf: 'center',
                    '&:hover': {
                          color: '#fff',
                          bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                      <MoreVertIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Box>
                
                  {message.role === 'assistant' && (
                <Button
                      className="message-actions"
                      startIcon={
                        loadingStates[message.id] ? (
                          <CircularProgress size={16} sx={{ color: '#C0FF92' }} />
                        ) : canvasStates[message.id] ? (
                          <RemoveIcon />
                        ) : (
                          <AddIcon />
                        )
                      }
                      size="small"
                      onClick={() => {
                        if (canvasStates[message.id]) {
                          handleRemoveFromCanvas(message.id, canvasStates[message.id]);
                        } else {
                          handleAddToCanvas(message.id, message.content);
                        }
                      }}
                      disabled={loadingStates[message.id]}
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
          </>
        )}
      </Box>

      {/* Message Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            bgcolor: '#262626',
            border: '1px solid #333',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            '& .MuiMenuItem-root': {
              fontSize: '14px',
              color: '#fff',
              '&:hover': {
                bgcolor: '#333',
              },
            },
          },
        }}
      >
        <MenuItem onClick={handleDeleteMessage}>
          <DeleteIcon sx={{ mr: 1, fontSize: 20, color: '#ff4444' }} />
          Delete Message
        </MenuItem>
      </Menu>

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
      </Box>
    </Box>
  )
}

export default ChatArea 