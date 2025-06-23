import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Box, CircularProgress, IconButton, Typography, TextField } from '@mui/material'
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import useResearchStore from '../store/researchStore'
import useCanvasStore from '../store/canvasStore'
import type { TextContent } from '../types/database'

function ResearchCanvas() {
  const { id: projectId } = useParams()
  const [editableContent, setEditableContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [removingItems, setRemovingItems] = useState<Record<string, boolean>>({})
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const {
    content,
    isLoading: researchLoading,
    error: researchError,
    fetchDocument,
    updateContentWithDebounce,
  } = useResearchStore()

  const {
    items,
    isLoading: canvasLoading,
    error: canvasError,
    fetchItems,
    clearCanvas,
    lastAddedItemId,
    lastRemovedItemId,
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
    setIsEditing(false)
    setRemovingItems({})
  }, [projectId])

  // Handle item removal animation
  useEffect(() => {
    if (lastRemovedItemId) {
      // Mark item as removing
      setRemovingItems(prev => ({ ...prev, [lastRemovedItemId]: true }))
      // Clean up after animation
      setTimeout(() => {
        setRemovingItems(prev => {
          const newState = { ...prev }
          delete newState[lastRemovedItemId]
          return newState
        })
      }, 300) // Match this with the CSS transition duration
    }
  }, [lastRemovedItemId])

  // Scroll to newly added item
  useEffect(() => {
    if (lastAddedItemId && itemRefs.current[lastAddedItemId]) {
      itemRefs.current[lastAddedItemId].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [lastAddedItemId, items])

  // Update editable content when content changes
  useEffect(() => {
    setEditableContent(content || '')
  }, [content])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setEditableContent(newContent)
    if (projectId) {
      updateContentWithDebounce(projectId, newContent)
    }
  }

  const handleSave = () => {
    if (!projectId) return
    setIsEditing(false)
  }

  const renderContent = () => {
    if (!content && items.length === 0) {
      return (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          textAlign: 'center',
          gap: 2,
          color: 'text.secondary'
        }}>
          <Typography variant="h6">
            No Research Content Yet
          </Typography>
          <Typography>
            Start a conversation in the chat and add interesting findings to your research canvas.
            You can add content by clicking the "+" button next to AI responses in the chat.
          </Typography>
        </Box>
      )
    }

    if (isEditing) {
      return (
        <Box sx={{ height: '100%' }}>
          <TextField
            multiline
            fullWidth
            variant="standard"
            value={editableContent}
            onChange={handleContentChange}
            InputProps={{
              disableUnderline: true,
              sx: {
                height: '100%',
                '& textarea': {
                  height: '100% !important',
                  color: 'inherit',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  lineHeight: 'inherit',
                  padding: 0,
                  backgroundColor: 'transparent',
                  resize: 'none',
                },
              }
            }}
            sx={{
              height: '100%',
              '& .MuiInputBase-root': {
                height: '100%',
              }
            }}
          />
        </Box>
      )
    }

    return (
      <>
        <Box sx={{ mb: 4 }}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => (
                <Typography 
                  paragraph 
                  sx={{ 
                    color: 'text.primary',
                    fontSize: '1rem',
                    lineHeight: 1.5,
                    mb: 2
                  }}
                >
                  {children}
                </Typography>
              ),
              h1: ({ children }) => (
                <Typography 
                  variant="h4" 
                  gutterBottom
                  sx={{ 
                    color: 'text.primary',
                    fontWeight: 500,
                    mb: 3
                  }}
                >
                  {children}
                </Typography>
              ),
              h2: ({ children }) => (
                <Typography 
                  variant="h5" 
                  gutterBottom
                  sx={{ 
                    color: 'text.primary',
                    fontWeight: 500,
                    mb: 2
                  }}
                >
                  {children}
                </Typography>
              ),
            }}
          >
            {editableContent || content || ''}
          </ReactMarkdown>
        </Box>
        {items.map((item) => {
          const content = item.content as TextContent
          return (
            <Box
              key={item.id}
              ref={(el: HTMLDivElement | null) => {
                itemRefs.current[item.id] = el
              }}
              sx={{
                opacity: removingItems[item.id] ? 0 : 1,
                transform: removingItems[item.id] ? 'translateX(100%)' : 'translateX(0)',
                transition: 'all 0.3s ease-in-out',
                mb: 2,
              }}
            >
              <Typography>{content.text}</Typography>
            </Box>
          )
        })}
      </>
    )
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
          disabled={researchLoading}
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
        {researchLoading || canvasLoading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}>
            <CircularProgress sx={{ color: '#C0FF92' }} />
          </Box>
        ) : researchError || canvasError ? (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            p: 4,
          }}>
            <Typography color="error" align="center" sx={{ color: '#ff6b6b' }}>
              {researchError || canvasError}
            </Typography>
            <IconButton
              onClick={() => {
                if (projectId) {
                  fetchDocument(projectId)
                  fetchItems(projectId)
                }
              }}
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
        ) : renderContent()}
      </Box>
    </Box>
  )
}

export default ResearchCanvas 