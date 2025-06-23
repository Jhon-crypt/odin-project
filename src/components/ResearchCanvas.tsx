import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Box, CircularProgress, IconButton, Typography, TextField } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import useResearchStore from '../store/researchStore'
import useCanvasStore from '../store/canvasStore'
import type { TextContent } from '../types/models'

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
    if (!isEditing) {
      setEditableContent(content || '')
    }
  }, [content, isEditing])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setEditableContent(newContent)
    if (projectId) {
      updateContentWithDebounce(projectId, newContent)
    }
  }

  const handleSave = () => {
    if (!projectId) return
    // Ensure the content is saved before exiting edit mode
    updateDocument(projectId, editableContent).then(() => {
      setIsEditing(false)
    })
  }

  const handleEdit = () => {
    setEditableContent(content || '') // Reset to current content when entering edit mode
    setIsEditing(true)
  }

  const formatText = (text: string) => {
    // Remove markdown syntax and apply proper styling
    return text
      .split('\n\n')
      .map(paragraph => {
        // Handle headings with **
        if (paragraph.match(/^\*\*([^*]+)\*\*$/)) {
          return {
            type: 'heading',
            content: paragraph.replace(/^\*\*([^*]+)\*\*$/, '$1')
          }
        }
        // Handle subheadings with * **
        if (paragraph.match(/^\* \*\*([^*]+)\*\*:/)) {
          return {
            type: 'subheading',
            content: paragraph.replace(/^\* \*\*([^*]+)\*\*:/, '$1')
          }
        }
        // Handle emphasized text within paragraphs
        return {
          type: 'paragraph',
          content: paragraph.replace(/\*\*([^*]+)\*\*/g, '$1')
        }
      })
  }

  const renderContent = () => {
    if (!content && !editableContent && items.length === 0) {
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
        <Box sx={{ 
          height: '100%',
          p: 3,
          maxWidth: '800px',
          margin: '0 auto',
          width: '100%'
        }}>
          <TextField
            multiline
            fullWidth
            variant="outlined"
            value={editableContent}
            onChange={handleContentChange}
            InputProps={{
              sx: {
                minHeight: '80vh',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: 1,
                '& textarea': {
                  minHeight: '80vh !important',
                  color: 'text.primary',
                  fontSize: '1rem',
                  lineHeight: '1.75',
                  letterSpacing: '0.00938em',
                  padding: '24px',
                  '&::placeholder': {
                    color: 'text.secondary',
                    opacity: 0.7
                  }
                },
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                  }
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#C0FF92 !important'
                }
              }
            }}
            placeholder="Start typing your research content here..."
          />
        </Box>
      )
    }

    return (
      <>
        <Box sx={{ 
          p: 3,
          color: 'text.primary',
          maxWidth: '800px',
          margin: '0 auto',
          width: '100%',
          '& > *:not(:last-child)': {
            mb: 2
          }
        }}>
          {formatText(content || '').map((block, index) => {
            if (block.type === 'heading') {
              return (
                <Typography 
                  key={index}
                  variant="h4"
                  sx={{ 
                    color: 'text.primary',
                    fontWeight: 600,
                    fontSize: '2rem',
                    mb: 3
                  }}
                >
                  {block.content}
                </Typography>
              )
            }
            if (block.type === 'subheading') {
              return (
                <Typography 
                  key={index}
                  variant="h5"
                  sx={{ 
                    color: 'text.primary',
                    fontWeight: 500,
                    fontSize: '1.5rem',
                    mb: 2
                  }}
                >
                  {block.content}
                </Typography>
              )
            }
            return (
              <Typography 
                key={index}
                paragraph
                sx={{ 
                  color: 'text.primary',
                  fontSize: '1rem',
                  lineHeight: '1.75',
                  letterSpacing: '0.00938em',
                  '& strong': {
                    fontWeight: 600
                  }
                }}
              >
                {block.content}
              </Typography>
            )
          })}
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
          onClick={() => isEditing ? handleSave() : handleEdit()}
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