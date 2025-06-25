import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import useCanvasStore from '../store/canvasStore'
import type { TextContent, CanvasItem } from '../types/models'
import { supabase } from '../lib/supabaseClient'

export const ResearchCanvas: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [removingItems, setRemovingItems] = useState<Record<string, boolean>>({})
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const {
    lastAddedItemId,
    lastRemovedItemId,
  } = useCanvasStore()

  const fetchCanvasItems = async () => {
    if (!id) return
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('canvas_items')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setCanvasItems(data || [])
    } catch (error) {
      console.error('Error fetching canvas items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log('ResearchCanvas mounted/updated with projectId:', id)
    if (id) {
      fetchCanvasItems()
    }
  }, [id])

  // Listen for canvas item updates
  useEffect(() => {
    const handleCanvasUpdate = (event: CustomEvent<{ items: CanvasItem[] }>) => {
      setCanvasItems(event.detail.items || [])
    }

    window.addEventListener('canvasItemAdded', handleCanvasUpdate as EventListener)
    
    return () => {
      window.removeEventListener('canvasItemAdded', handleCanvasUpdate as EventListener)
    }
  }, [])

  useEffect(() => {
    // Refetch items when something is added or removed
    if (id && (lastAddedItemId || lastRemovedItemId)) {
      fetchCanvasItems()
    }
  }, [id, lastAddedItemId, lastRemovedItemId])

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
  }, [lastAddedItemId, canvasItems])

  const renderContent = () => {
    if (isLoading) {
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

    if (canvasItems.length === 0) {
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
        {canvasItems.map((item) => {
          if (item.type !== 'text') return null;
          const content = item.content as TextContent;
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
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>{content.text}</Typography>
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