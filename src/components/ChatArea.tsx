import {
  Box,
  Typography,
  Avatar,
  Paper,
  Button,
  TextField,
  IconButton,
  Stack,
  useMediaQuery,
} from '@mui/material'
import {
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Mic as MicIcon,
  EmojiEmotions as EmojiIcon,
  Send as SendIcon,
} from '@mui/icons-material'
import { useState } from 'react'

function ChatArea() {
  const [message, setMessage] = useState('')
  const isMobile = useMediaQuery('(max-width:767px)')

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message)
      setMessage('')
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#111111',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          px: { xs: 1.5, sm: 2, md: 3, lg: 4 },
          py: { xs: 1.5, sm: 2, md: 3 },
          pt: { xs: 2, sm: 2, md: 3 },
          width: '100%',
          '-webkit-overflow-scrolling': 'touch',
        }}
      >
        <Stack spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {/* User Message */}
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 1.5, md: 2 },
            width: '100%',
            mt: { xs: 1, sm: 0 },
          }}>
            <Avatar
              sx={{
                width: { xs: 26, sm: 32, md: 36 },
                height: { xs: 26, sm: 32, md: 36 },
                bgcolor: '#C0FF92',
                color: '#000',
                fontSize: { xs: '10px', sm: '12px', md: '14px' },
                fontWeight: 'bold',
                flexShrink: 0,
              }}
            >
              EL
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  color: '#C0FF92',
                  fontSize: { xs: '11px', sm: '13px', md: '14px' },
                  fontWeight: 'bold',
                  mb: { xs: 0.5, sm: 1 },
                }}
              >
                Emily Liu
              </Typography>
              <Typography
                sx={{
                  color: '#ccc',
                  fontSize: { xs: '11px', sm: '13px', md: '14px' },
                  lineHeight: { xs: 1.4, sm: 1.5 },
                  wordBreak: 'break-word',
                }}
              >
                Can you analyze the psychological dynamics of a spaceship crew on a long-duration mission to Mars? 
                Focus on leadership structures, conflict resolution, and maintaining team cohesion in isolated environments.
              </Typography>
            </Box>
          </Box>

          {/* AI Assistant Message */}
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 1.5, md: 2 },
            width: '100%',
          }}>
            <Avatar
              sx={{
                width: { xs: 26, sm: 32, md: 36 },
                height: { xs: 26, sm: 32, md: 36 },
                bgcolor: '#333',
                color: '#C0FF92',
                fontSize: { xs: '10px', sm: '12px', md: '14px' },
                fontWeight: 'bold',
                flexShrink: 0,
              }}
            >
              AI
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  color: '#C0FF92',
                  fontSize: { xs: '11px', sm: '13px', md: '14px' },
                  fontWeight: 'bold',
                  mb: { xs: 0.5, sm: 1 },
                }}
              >
                Odin
              </Typography>
              
              <Typography
                sx={{
                  color: '#ccc',
                  fontSize: { xs: '11px', sm: '13px', md: '14px' },
                  lineHeight: { xs: 1.4, sm: 1.5 },
                  mb: { xs: 1.5, sm: 2 },
                  wordBreak: 'break-word',
                }}
              >
                Based on extensive research in space psychology and team dynamics, here's a comprehensive analysis 
                of spaceship crew psychology during long-duration missions:
              </Typography>

              {/* AI Response Images */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: { xs: 1, sm: 1.5, md: 2 },
                  mb: { xs: 1.5, sm: 2 },
                  width: '100%',
                }}
              >
                <Paper
                  sx={{
                    aspectRatio: '4/3',
                    bgcolor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: { xs: '6px', sm: '8px', md: '12px' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 0.5, sm: 1, md: 2 },
                  }}
                >
                  <Typography
                    sx={{
                      color: '#888',
                      fontSize: { xs: '9px', sm: '10px', md: '12px' },
                      textAlign: 'center',
                      lineHeight: 1.2,
                    }}
                  >
                    Leadership Hierarchy<br/>Visualization
                  </Typography>
                </Paper>
                
                <Paper
                  sx={{
                    aspectRatio: '4/3',
                    bgcolor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: { xs: '6px', sm: '8px', md: '12px' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 0.5, sm: 1, md: 2 },
                  }}
                >
                  <Typography
                    sx={{
                      color: '#888',
                      fontSize: { xs: '9px', sm: '10px', md: '12px' },
                      textAlign: 'center',
                      lineHeight: 1.2,
                    }}
                  >
                    Conflict Resolution<br/>Framework
                  </Typography>
                </Paper>
              </Box>

              <Typography
                sx={{
                  color: '#ccc',
                  fontSize: { xs: '11px', sm: '13px', md: '14px' },
                  lineHeight: { xs: 1.4, sm: 1.5 },
                  mb: { xs: 1.5, sm: 2, md: 3 },
                  wordBreak: 'break-word',
                }}
              >
                Key factors include establishing clear command structures, implementing regular psychological 
                evaluations, creating private spaces for crew members, and developing protocols for managing 
                interpersonal conflicts in confined environments.
              </Typography>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  gap: { xs: 1, sm: 1.5 },
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                <Button
                  startIcon={<RefreshIcon sx={{ fontSize: { xs: 12, sm: 14, md: 16 } }} />}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{
                    color: '#888',
                    textTransform: 'none',
                    fontSize: { xs: '10px', sm: '12px', md: '14px' },
                    minHeight: { xs: '28px', sm: '32px' },
                    px: { xs: 1, sm: 1.5 },
                    '&:hover': {
                      bgcolor: '#333',
                      color: '#C0FF92',
                    },
                  }}
                >
                  {isMobile ? 'Regen' : 'Regenerate'}
                </Button>
                
                <Button
                  startIcon={<EditIcon sx={{ fontSize: { xs: 12, sm: 14, md: 16 } }} />}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{
                    color: '#888',
                    textTransform: 'none',
                    fontSize: { xs: '10px', sm: '12px', md: '14px' },
                    minHeight: { xs: '28px', sm: '32px' },
                    px: { xs: 1, sm: 1.5 },
                    '&:hover': {
                      bgcolor: '#333',
                      color: '#C0FF92',
                    },
                  }}
                >
                  Edit
                </Button>

                <Button
                  startIcon={<AddIcon sx={{ fontSize: { xs: 12, sm: 14, md: 16 } }} />}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{
                    color: '#888',
                    textTransform: 'none',
                    fontSize: { xs: '10px', sm: '12px', md: '14px' },
                    minHeight: { xs: '28px', sm: '32px' },
                    px: { xs: 1, sm: 1.5 },
                    '&:hover': {
                      bgcolor: '#333',
                      color: '#C0FF92',
                    },
                  }}
                >
                  {isMobile ? 'Add' : 'Add to Canvas'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Box>

      {/* Message Input Area - Mobile Optimized */}
      <Box
        sx={{
          borderTop: '1px solid #333',
          p: { xs: 1.5, sm: 2, md: 3 },
          bgcolor: '#111111',
          flexShrink: 0,
          width: '100%',
          pb: { xs: 2, sm: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1, sm: 2 },
            alignItems: 'flex-end',
            width: '100%',
          }}
        >
          <TextField
            multiline
            maxRows={isMobile ? 3 : 4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isMobile ? "Ask a question..." : "Type your research question..."}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                bgcolor: '#1a1a1a',
                fontSize: { xs: '14px', sm: '15px', md: '16px' },
                borderRadius: { xs: '8px', sm: '10px', md: '12px' },
                '& fieldset': {
                  borderColor: '#333',
                },
                '&:hover fieldset': {
                  borderColor: '#555',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#C0FF92',
                },
              },
              '& .MuiOutlinedInput-input': {
                py: { xs: 1, sm: 1.25, md: 1.5 },
                px: { xs: 1.5, sm: 2 },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#888',
                opacity: 1,
              },
            }}
          />
          
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 0.5, sm: 1 }, 
            alignItems: 'center',
            flexShrink: 0,
          }}>
            {!isMobile && (
              <>
                <IconButton
                  size="medium"
                  sx={{
                    color: '#888',
                    '&:hover': {
                      color: '#C0FF92',
                      bgcolor: '#333',
                    },
                  }}
                >
                  <MicIcon sx={{ fontSize: 20 }} />
                </IconButton>
                
                <IconButton
                  size="medium"
                  sx={{
                    color: '#888',
                    '&:hover': {
                      color: '#C0FF92',
                      bgcolor: '#333',
                    },
                  }}
                >
                  <EmojiIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </>
            )}
            
            <IconButton
              onClick={handleSendMessage}
              disabled={!message.trim()}
              size={isMobile ? 'small' : 'medium'}
              sx={{
                bgcolor: message.trim() ? '#C0FF92' : '#333',
                color: message.trim() ? '#000' : '#666',
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                '&:hover': {
                  bgcolor: message.trim() ? '#A8E87C' : '#444',
                },
                '&.Mui-disabled': {
                  bgcolor: '#333',
                  color: '#666',
                },
              }}
            >
              <SendIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ChatArea 