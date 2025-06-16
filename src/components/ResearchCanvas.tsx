import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, CircularProgress, IconButton, Typography } from '@mui/material'
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import useResearchStore from '../store/researchStore'
import useCanvasStore from '../store/canvasStore'

function ResearchCanvas() {
  const { id: projectId } = useParams()
  const [editableContent, setEditableContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const {
    content,
    isLoading: researchLoading,
    error: researchError,
    fetchDocument,
    updateDocument,
  } = useResearchStore()

  const {
    fetchItems,
    clearCanvas,
  } = useCanvasStore()

  // Clear canvas and fetch items when project changes
  useEffect(() => {
    if (projectId) {
      console.log('ResearchCanvas: Clearing canvas and fetching items for project:', projectId)
      clearCanvas()
      fetchItems(projectId)
      fetchDocument(projectId)
    }
    // Reset local state
    setEditableContent('')
    setIsSaving(false)
    setIsEditing(false)
  }, [projectId]) // Remove fetchItems, clearCanvas, and fetchDocument from dependencies

  // Update editable content when content changes
  useEffect(() => {
    setEditableContent(content || '')
  }, [content])

  const handleSave = async () => {
    if (!projectId) return
    setIsSaving(true)
    try {
      await updateDocument(projectId, editableContent)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save document:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
      }}>
        <Typography variant="h6" sx={{ color: '#C0FF92' }}>Research</Typography>
        <IconButton
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={researchLoading || isSaving}
          size="small"
          sx={{
            color: '#C0FF92',
            '&:hover': {
              backgroundColor: 'rgba(192, 255, 146, 0.08)',
            },
          }}
        >
          {isEditing ? <SaveIcon /> : <EditIcon />}
        </IconButton>
      </Box>

      <Box sx={{
        flex: 1,
        p: 2,
        overflow: 'auto',
        '-webkit-overflow-scrolling': 'touch',
      }}>
        {researchLoading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}>
            <CircularProgress sx={{ color: '#C0FF92' }} />
          </Box>
        ) : researchError ? (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            p: 4,
          }}>
            <Typography color="error" align="center" sx={{ color: '#ff6b6b' }}>
              {researchError}
            </Typography>
            <IconButton
              onClick={() => projectId && fetchDocument(projectId)}
              size="small"
              sx={{
                color: '#C0FF92',
                '&:hover': {
                  backgroundColor: 'rgba(192, 255, 146, 0.08)',
                },
              }}
            >
              Retry
            </IconButton>
          </Box>
        ) : isEditing ? (
          <textarea
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent',
              color: 'inherit',
              border: 'none',
              resize: 'none',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              padding: 0,
              outline: 'none',
            }}
          />
        ) : (
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => (
                <Typography paragraph>{children}</Typography>
              ),
              h1: ({ children }) => (
                <Typography variant="h4" gutterBottom>{children}</Typography>
              ),
              h2: ({ children }) => (
                <Typography variant="h5" gutterBottom>{children}</Typography>
              ),
              h3: ({ children }) => (
                <Typography variant="h6" gutterBottom>{children}</Typography>
              ),
            }}
          >
            {content || ''}
          </ReactMarkdown>
        )}
      </Box>
    </Box>
  )
}

export default ResearchCanvas 