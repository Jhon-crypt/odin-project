import React, { useEffect, useState, useRef } from 'react'
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
  Avatar,
  Button,
  Menu,
  MenuItem,
  Fade,
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
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useParams } from 'react-router-dom'
import useChatStore from '../store/chatStore'
import useCanvasStore from '../store/canvasStore'
import useAuth from '../hooks/useAuth'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { supabase } from '../lib/supabaseClient'
import CloseIcon from '@mui/icons-material/Close'

function ChatArea() {
  const { id: projectId } = useParams()
  const [input, setInput] = useState('')
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [canvasStates, setCanvasStates] = useState<Record<string, string>>({})
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const lastMessageRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const [showScrollButtons, setShowScrollButtons] = useState(false)
  
  const {
    messages,
    isLoading: isChatLoading,
    error: chatError,
    fetchMessages,
    sendMessage,
    deleteMessage,
    streamingMessageId,
    streamingContent,
  } = useChatStore()

  const { items } = useCanvasStore()

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

  // Scroll to the start of new message when messages change
  useEffect(() => {
    if (messages.length > 0) {
      lastMessageRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' })
    }
  }, [messages])

  // Check canvas state for each AI message
  useEffect(() => {
    const checkCanvasStates = async () => {
      if (!projectId) return;
      
      const states: Record<string, string> = {};
      for (const message of messages) {
        if (message.role === 'assistant' && message.content) {
          try {
            const { data, error } = await supabase
              .from('canvas_items')
              .select('id')
              .eq('project_id', projectId)
              .eq('type', 'text')
              .eq('content ->> text', message.content)
              .single()

            if (!error && data) {
              states[message.id] = data.id;
            }
          } catch (error) {
            console.error('Error checking canvas state:', error);
          }
        }
      }
      setCanvasStates(states);
    };
    
    checkCanvasStates();
  }, [messages, projectId, items]); // Keep items dependency to refresh when canvas changes

  // Handle scroll events
  useEffect(() => {
    const container = chatContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollHeight = container.scrollHeight
      const clientHeight = container.clientHeight

      // Show buttons if content is scrollable
      setShowScrollButtons(scrollHeight > clientHeight)
    }

    container.addEventListener('scroll', handleScroll)
    // Initial check
    handleScroll()

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    chatContainerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

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

  const handleAddToCanvas = async (content: string, messageId: string) => {
    if (!projectId) return
    setLoadingStates(prev => ({ ...prev, [messageId]: true }))
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user?.user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('canvas_items')
        .insert({
          project_id: projectId,
          type: 'text',
          content: { text: content },
          position: { x: 0, y: 0 },
          created_by: user.user.id,
        })
        .select('id')
        .single()

      if (error) throw error

      // Update canvas states immediately
      setCanvasStates(prev => ({ ...prev, [messageId]: data.id }))

      // Fetch canvas items to refresh the canvas
      const { data: canvasItems, error: fetchError } = await supabase
        .from('canvas_items')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError

      // Emit an event to notify ResearchCanvas to update
      window.dispatchEvent(new CustomEvent('canvasItemAdded', { detail: { items: canvasItems } }))

    } catch (error) {
      console.error('Error adding to canvas:', error)
    } finally {
      setLoadingStates(prev => ({ ...prev, [messageId]: false }))
    }
  }

  const handleRemoveFromCanvas = async (messageId: string, itemId: string) => {
    if (!projectId) return
    setLoadingStates(prev => ({ ...prev, [messageId]: true }))
    try {
      const { error } = await supabase
        .from('canvas_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      // Remove from local state
      setCanvasStates(prev => {
        const newState = { ...prev }
        delete newState[messageId]
        return newState
      })

      // Fetch updated canvas items
      const { data: canvasItems, error: fetchError } = await supabase
        .from('canvas_items')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError

      // Emit event to notify ResearchCanvas to update
      window.dispatchEvent(new CustomEvent('canvasItemAdded', { detail: { items: canvasItems } }))

    } catch (error) {
      console.error('Error removing from canvas:', error)
    } finally {
      setLoadingStates(prev => ({ ...prev, [messageId]: false }))
    }
  }

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
    <Box sx={{ height: '100%', position: 'relative' }}>
    <Box
        ref={chatContainerRef}
      sx={{
        height: '100%',
          overflow: 'auto',
          scrollBehavior: 'auto',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
          gap: 2,
          p: 2
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Box
        sx={{
            flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
            gap: 2,
            mb: 2
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
                        mr: 1.5
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
                        mb: 0.5
                    }}
                  >
                      {message.role === 'user' ? user?.email?.split('@')[0] || 'You' : 'Odin'}
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
                            {message.id === streamingMessageId ? streamingContent : message.content}
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
                            handleAddToCanvas(message.content, message.id);
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

        <Box sx={{ position: 'sticky', bottom: 0, bgcolor: 'background.paper', pt: 2 }}>
          {selectedImages.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
                      borderRadius: '4px',
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      bgcolor: 'background.paper',
                      '&:hover': { bgcolor: 'background.paper' },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                },
              }}
            />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <IconButton
              onClick={() => fileInputRef.current?.click()}
              sx={{ color: 'text.secondary' }}
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

      <Fade in={showScrollButtons}>
        <Box sx={{
          position: 'absolute',
          right: 2,
          bottom: 80,
            display: 'flex',
            flexDirection: 'column',
          gap: 1,
          zIndex: 1,
        }}>
                  <IconButton
            onClick={scrollToTop}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
                '&:hover': {
                bgcolor: 'background.paper',
                opacity: 0.9
              }
          }}
            size="small"
        >
            <KeyboardArrowUpIcon />
            </IconButton>
          <IconButton
            onClick={scrollToBottom}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': {
                bgcolor: 'background.paper',
                opacity: 0.9
              }
            }}
            size="small"
          >
            <KeyboardArrowDownIcon />
          </IconButton>
        </Box>
      </Fade>
    </Box>
  )
}

export default ChatArea 