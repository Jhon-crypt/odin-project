import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Box, CircularProgress, IconButton, Typography, Collapse } from '@mui/material'
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import useResearchStore from '../store/researchStore'
import useCanvasStore from '../store/canvasStore'
import type { TextContent } from '../types/database'

function ResearchCanvas() {
  const { id: projectId } = useParams()
  const [editableContent, setEditableContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [removingItems, setRemovingItems] = useState<Record<string, boolean>>({})
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const {
    content,
    isLoading: researchLoading,
    error: researchError,
    fetchDocument,
    updateDocument,
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
    setIsSaving(false)
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
          <>
            {!content && items.length === 0 && (
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
            )}
            {(content || items.length > 0) && (
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
            {items.map((item) => {
              const content = item.content as TextContent
              return (
                <Collapse
                  key={item.id}
                  in={!removingItems[item.id]}
                  timeout={300}
                  unmountOnExit
                >
                  <Box
                    ref={el => {
                      itemRefs.current[item.id] = el as HTMLDivElement
                    }}
                    sx={{
                      mt: 2,
                      p: 2,
                      transition: 'all 0.3s ease-in-out',
                      opacity: removingItems[item.id] ? 0 : 1,
                      transform: removingItems[item.id] ? 'translateX(-20px)' : 'translateX(0)',
                    }}
                  >
                    <Typography>
                      {content.text}
                    </Typography>
                  </Box>
                </Collapse>
              )
            })}
          </>
        )}
      </Box>
    </Box>
  )
}

export default ResearchCanvas 