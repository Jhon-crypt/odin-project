import {
  Box,
  Typography,
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
    isLoading,
    error,
    isEditing,
    fetchDocument,
    updateDocument,
    setIsEditing,
  } = useResearchStore()
  const [editableContent, setEditableContent] = useState(content)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    console.log('ResearchCanvas: projectId changed:', projectId)
    if (projectId) {
      fetchDocument(projectId)
    }
  }, [projectId, fetchDocument])

  useEffect(() => {
    console.log('ResearchCanvas: content changed:', content)
    setEditableContent(content)
  }, [content])

  const handleSave = async () => {
    if (!projectId) return
    try {
      setIsSaving(true)
      await updateDocument(projectId, editableContent)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving document:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!projectId) return null

  console.log('ResearchCanvas: rendering with state:', {
    content,
    editableContent,
    isLoading,
    error,
    isEditing,
  })

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DescriptionIcon sx={{ 
            color: '#C0FF92', 
            fontSize: { xs: 18, sm: 20 } 
          }} />
          <Typography
            variant="h6"
            sx={{
              color: '#C0FF92',
              fontWeight: 'bold',
              fontSize: { xs: '14px', sm: '16px', md: '18px' },
            }}
          >
            Research Document
          </Typography>
        </Box>
        
        <IconButton
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={isLoading || isSaving}
          size="small"
          sx={{
            color: '#C0FF92',
            bgcolor: 'transparent',
            border: '1px solid #333',
            '&:hover': {
              bgcolor: '#333',
            },
            '&.Mui-disabled': {
              color: '#666',
              borderColor: '#444',
            },
          }}
        >
          {isSaving ? (
            <CircularProgress size={20} sx={{ color: '#C0FF92' }} />
          ) : isEditing ? (
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
        p: { xs: 2, sm: 3 },
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
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: 2,
            p: 3,
          }}>
            <Typography color="error" align="center" sx={{ color: '#ff6b6b' }}>
              {error}
            </Typography>
            <IconButton
              onClick={() => projectId && fetchDocument(projectId)}
              size="small"
              sx={{
                color: '#C0FF92',
                bgcolor: 'transparent',
                border: '1px solid #333',
                '&:hover': {
                  bgcolor: '#333',
                },
              }}
            >
              Try Again
            </IconButton>
          </Box>
        ) : isEditing ? (
          <TextField
            multiline
            fullWidth
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
            variant="outlined"
            placeholder="Start writing your research document..."
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
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
        ) : content ? (
          <Box sx={{
            color: '#fff',
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              color: '#C0FF92',
              fontWeight: 'bold',
              mb: 2,
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
              lineHeight: 1.7,
            },
            '& ul, & ol': {
              pl: 3,
              mb: 2,
            },
            '& li': {
              mb: 1,
            },
            '& code': {
              bgcolor: '#111',
              p: 0.5,
              borderRadius: 1,
              fontFamily: 'monospace',
            },
            '& pre': {
              bgcolor: '#111',
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
              color: '#ccc',
            },
            '& a': {
              color: '#C0FF92',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            '& table': {
              width: '100%',
              borderCollapse: 'collapse',
              mb: 2,
              '& th, & td': {
                border: '1px solid #333',
                p: 1,
              },
              '& th': {
                bgcolor: '#111',
                color: '#C0FF92',
                fontWeight: 'bold',
              },
            },
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </Box>
        ) : (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: 2,
            p: 3,
          }}>
            <Typography align="center" sx={{ color: '#888' }}>
              No content yet. Click the edit button to start writing.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ResearchCanvas 