import {
  Box,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
} from '@mui/material'
import DescriptionIcon from '@mui/icons-material/Description'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useCanvasStore from '../store/canvasStore'
import type { 
  CanvasItem, 
  TextContent, 
  NoteContent, 
  LinkContent, 
  ImageContent, 
  FileContent 
} from '../types/database'

function getItemText(item: CanvasItem): string {
  switch (item.type) {
    case 'text':
    case 'note':
      return (item.content as TextContent | NoteContent).text;
    case 'link':
      return (item.content as LinkContent).title;
    case 'image':
      return (item.content as ImageContent).alt || 'Image';
    case 'file':
      return (item.content as FileContent).name;
    default:
      return '';
  }
}

function ResearchCanvas() {
  const { id: projectId } = useParams()
  const { items, isLoading, error, fetchItems } = useCanvasStore()
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (projectId) {
      fetchItems(projectId)
    }
  }, [projectId, fetchItems])

  if (!projectId) return null

  // Combine all text content into a single document
  const documentContent = items
    .filter(item => item.type === 'text' || item.type === 'note')
    .map(item => getItemText(item))
    .join('\n\n')

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
          onClick={() => setIsEditing(!isEditing)}
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
            {items.length === 0 ? (
              <Typography color="#666" align="center">
                Add items from the chat to start building your research document
              </Typography>
            ) : (
              <Box
                sx={{
                  color: '#ccc',
                  fontSize: { xs: '14px', sm: '15px', md: '16px' },
                  lineHeight: { xs: 1.6, sm: 1.8 },
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  whiteSpace: 'pre-wrap',
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
                }}
              >
                {documentContent}
              </Box>
            )}
          </Paper>
        )}
      </Box>
    </Box>
  )
}

export default ResearchCanvas 