import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import useCanvasStore from '../store/canvasStore'
import type { TextContent } from '../types/models'

export const ResearchCanvas: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const [removingItems, setRemovingItems] = useState<Record<string, boolean>>({})
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const {
    items,
    isLoading: canvasLoading,
    fetchItems,
    lastAddedItemId,
    lastRemovedItemId,
  } = useCanvasStore()

  useEffect(() => {
    console.log('ResearchCanvas mounted/updated with projectId:', projectId)
    if (projectId) {
      fetchItems(projectId)
    }
  }, [projectId, fetchItems])

  useEffect(() => {
    if (lastRemovedItemId) {
      setRemovingItems(prev => ({ ...prev, [lastRemovedItemId]: true }))
      setTimeout(() => {
        setRemovingItems(prev => {
          const newState = { ...prev }
          delete newState[lastRemovedItemId]
          return newState
        })
      }, 300)
    }
  }, [lastRemovedItemId])

  useEffect(() => {
    if (lastAddedItemId && itemRefs.current[lastAddedItemId]) {
      itemRefs.current[lastAddedItemId].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [lastAddedItemId, items])

  const renderContent = () => {
    if (canvasLoading) {
      return (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}>
          <CircularProgress />
        </Box>
      )
    }

    if (!items || items.length === 0) {
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

    return (
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
        {items.map((item) => {
          if (item.type !== 'text') return null
          const content = item.content as TextContent
          console.log('Rendering item:', item) // Add logging to debug
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
                p: 2,
                borderRadius: 1,
                bgcolor: 'rgba(192, 255, 146, 0.1)',
                border: '1px solid rgba(192, 255, 146, 0.2)',
              }}
            >
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                {content.text}
              </Typography>
            </Box>
          )
        })}
      </Box>
    )
  }

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      {renderContent()}
    </Box>
  )
}

export default ResearchCanvas 