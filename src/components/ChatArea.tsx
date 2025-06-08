import {
  Box,
  Typography,
  Avatar,
  Paper,
  Button,
  TextField,
  IconButton,
  Stack,
} from '@mui/material'
import {
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Mic as MicIcon,
  EmojiEmotions as EmojiIcon,
  Send as SendIcon,
} from '@mui/icons-material'
import { useState } from 'react'

function ChatArea() {
  const [message, setMessage] = useState('')

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
      }}
    >


      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          px: 4,
          py: 3,
        }}
      >
        <Stack spacing={3}>
          {/* User Message */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: '#C0FF92',
                color: '#000',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              EL
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  color: '#C0FF92',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  mb: 1,
                }}
              >
                Emily Liu
              </Typography>
              <Typography
                sx={{
                  color: '#ccc',
                  fontSize: '14px',
                  lineHeight: 1.5,
                }}
              >
                Can you analyze the psychological dynamics of a spaceship crew on a long-duration mission to Mars? 
                Focus on leadership structures, conflict resolution, and maintaining team cohesion in isolated environments.
              </Typography>
            </Box>
          </Box>

          {/* AI Assistant Message */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: '#333',
                color: '#C0FF92',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              AI
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  color: '#C0FF92',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  mb: 1,
                }}
              >
                Artificium
              </Typography>
              
              <Typography
                sx={{
                  color: '#ccc',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  mb: 2,
                }}
              >
                Based on extensive research in space psychology and team dynamics, here's a comprehensive analysis 
                of spaceship crew psychology during long-duration missions:
              </Typography>

              {/* AI Response Images */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 2,
                  mb: 2,
                }}
              >
                <Paper
                  sx={{
                    aspect: '4/3',
                    bgcolor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: '#888',
                      fontSize: '12px',
                      textAlign: 'center',
                    }}
                  >
                    Leadership Hierarchy<br/>Visualization
                  </Typography>
                </Paper>
                
                <Paper
                  sx={{
                    aspect: '4/3',
                    bgcolor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: '#888',
                      fontSize: '12px',
                      textAlign: 'center',
                    }}
                  >
                    Conflict Resolution<br/>Framework
                  </Typography>
                </Paper>
              </Box>

              <Typography
                sx={{
                  color: '#ccc',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  mb: 3,
                }}
              >
                Key factors include establishing clear command structures, implementing regular psychological 
                evaluations, creating private spaces for crew members, and developing protocols for managing 
                interpersonal conflicts in confined spaces.
              </Typography>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<RefreshIcon />}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: '#333',
                    color: '#888',
                    textTransform: 'none',
                    fontSize: '12px',
                    '&:hover': {
                      borderColor: '#C0FF92',
                      color: '#C0FF92',
                    },
                  }}
                >
                  Regenerate response
                </Button>
                
                <Button
                  startIcon={<EditIcon />}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: '#333',
                    color: '#888',
                    textTransform: 'none',
                    fontSize: '12px',
                    '&:hover': {
                      borderColor: '#C0FF92',
                      color: '#C0FF92',
                    },
                  }}
                >
                  Modify
                </Button>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Box>

      {/* Message Input */}
      <Box
        sx={{
          px: 4,
          py: 3,
          borderTop: '1px solid #333',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 1,
            bgcolor: '#1a1a1a',
            borderRadius: '12px',
            border: '1px solid #333',
            p: 1,
          }}
        >
          <TextField
            multiline
            maxRows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Artificium anything about your research..."
            variant="standard"
            sx={{
              flex: 1,
              '& .MuiInputBase-root': {
                color: '#fff',
                fontSize: '14px',
                px: 2,
                py: 1,
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#888',
                opacity: 1,
              },
              '& .MuiInput-underline:before': {
                display: 'none',
              },
              '& .MuiInput-underline:after': {
                display: 'none',
              },
            }}
          />
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              size="small"
              sx={{
                color: '#888',
                '&:hover': {
                  color: '#C0FF92',
                },
              }}
            >
              <MicIcon fontSize="small" />
            </IconButton>
            
            <IconButton
              size="small"
              sx={{
                color: '#888',
                '&:hover': {
                  color: '#C0FF92',
                },
              }}
            >
              <EmojiIcon fontSize="small" />
            </IconButton>
            
            <IconButton
              size="small"
              onClick={handleSendMessage}
              disabled={!message.trim()}
              sx={{
                color: message.trim() ? '#C0FF92' : '#888',
                '&:hover': {
                  color: '#A8E67A',
                },
                '&.Mui-disabled': {
                  color: '#555',
                },
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ChatArea 