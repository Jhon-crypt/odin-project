import {
  Box,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  TextField,
} from '@mui/material'
import DescriptionIcon from '@mui/icons-material/Description'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useResearchStore from '../store/researchStore'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function ResearchCanvas() {
  const { id: projectId } = useParams()
  const {
    content,
    title,
    isLoading,
    error,
    isEditing,
    fetchDocument,
    updateDocument,
    setIsEditing,
  } = useResearchStore()
  const [editableContent, setEditableContent] = useState(content)
  const [editableTitle, setEditableTitle] = useState(title)

  useEffect(() => {
    if (projectId) {
      fetchDocument(projectId)
    }
  }, [projectId, fetchDocument])

  useEffect(() => {
    setEditableContent(content)
    setEditableTitle(title)
  }, [content, title])

  const handleSave = async () => {
    if (!projectId) return
    await updateDocument(projectId, editableContent, editableTitle)
    setIsEditing(false)
  }

  if (!projectId) return null

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        bgcolor: '#1a1a1a',
        borderLeft: '1px solid #333',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: { xs: 1.5, sm: 2, md: 3 }, 
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <DescriptionIcon sx={{ 
            color: '#C0FF92', 
            fontSize: { xs: 18, sm: 20 } 
          }} />
          {isEditing ? (
            <TextField
              value={editableTitle}
              onChange={(e) => setEditableTitle(e.target.value)}
              variant="standard"
              sx={{
                flex: 1,
                '& .MuiInputBase-root': {
                  color: '#C0FF92',
                  fontSize: { xs: '14px', sm: '16px', md: '18px' },
                  fontWeight: 'bold',
                  '&:before, &:after': {
                    borderColor: '#333',
                  },
                  '&:hover:before': {
                    borderColor: '#444 !important',
                  },
                  '&.Mui-focused:after': {
                    borderColor: '#C0FF92',
                  },
                },
              }}
            />
          ) : (
            <Typography
              variant="h6"
              sx={{
                color: '#C0FF92',
                fontWeight: 'bold',
                fontSize: { xs: '14px', sm: '16px', md: '18px' },
              }}
            >
              {title}
            </Typography>
          )}
        </Box>
        
        <IconButton
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          size="small"
          sx={{
            color: '#C0FF92',
            bgcolor: 'transparent',
            border: '1px solid #333',
            '&:hover': {
              bgcolor: '#333',
            },
            ml: 2,
          }}
        >
          {isEditing ? (
            <SaveIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          ) : (
            <EditIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          )}
        </IconButton>
      </Box>

      {/* Document Content */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        '-webkit-overflow-scrolling': 'touch',
      }}>
        {isLoading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%' 
          }}>
            <CircularProgress sx={{ color: '#C0FF92' }} />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        ) : (
          <Paper
            elevation={0}
            sx={{
              bgcolor: '#111111',
              minHeight: '100%',
              borderRadius: 0,
              border: 'none',
              p: { xs: 2, sm: 3, md: 4 },
            }}
          >
            {isEditing ? (
              <TextField
                multiline
                fullWidth
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#ccc',
                    bgcolor: '#1a1a1a',
                    '& fieldset': {
                      borderColor: '#333',
                    },
                    '&:hover fieldset': {
                      borderColor: '#444',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#C0FF92',
                    },
                  },
                }}
              />
            ) : (
              <Box
                sx={{
                  color: '#ccc',
                  fontSize: { xs: '14px', sm: '15px', md: '16px' },
                  lineHeight: { xs: 1.6, sm: 1.8 },
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  '& h1, & h2, & h3': {
                    color: '#fff',
                    fontWeight: 'bold',
                    mb: 2,
                    mt: 3,
                  },
                  '& h1': {
                    fontSize: { xs: '20px', sm: '22px', md: '24px' },
                  },
                  '& h2': {
                    fontSize: { xs: '18px', sm: '19px', md: '20px' },
                  },
                  '& h3': {
                    fontSize: { xs: '16px', sm: '17px', md: '18px' },
                  },
                  '& p': {
                    mb: 2,
                  },
                  '& ul, & ol': {
                    pl: 3,
                    mb: 2,
                  },
                  '& li': {
                    mb: 1,
                  },
                  '& code': {
                    bgcolor: '#1a1a1a',
                    p: 0.5,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                  },
                  '& pre': {
                    bgcolor: '#1a1a1a',
                    p: 2,
                    borderRadius: 1,
                    overflowX: 'auto',
                    '& code': {
                      p: 0,
                    },
                  },
                  '& blockquote': {
                    borderLeft: '4px solid #C0FF92',
                    pl: 2,
                    ml: 0,
                    my: 2,
                    color: '#888',
                  },
                  '& a': {
                    color: '#C0FF92',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  },
                  '& img': {
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: 1,
                  },
                  '& table': {
                    borderCollapse: 'collapse',
                    width: '100%',
                    mb: 2,
                  },
                  '& th, & td': {
                    border: '1px solid #333',
                    p: 1,
                  },
                  '& th': {
                    bgcolor: '#1a1a1a',
                    fontWeight: 'bold',
                  },
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </Box>
            )}
          </Paper>
        )}
      </Box>
    </Box>
  )
}

export default ResearchCanvas 