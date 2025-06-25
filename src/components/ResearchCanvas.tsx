import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Box, CircularProgress, Typography, IconButton, Fade } from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import useCanvasStore from '../store/canvasStore'
import type { TextContent, CanvasItem } from '../types/models'
import { supabase } from '../lib/supabaseClient'
import { marked } from 'marked'

// Configure marked options
marked.setOptions({
  breaks: true, // Enable line breaks
  gfm: true,    // Enable GitHub Flavored Markdown
})

export const ResearchCanvas: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [removingItems, setRemovingItems] = useState<Record<string, boolean>>({})
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showScrollButtons, setShowScrollButtons] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const {
    lastAddedItemId,
    lastRemovedItemId,
  } = useCanvasStore()

  const renderMarkdown = (text: string) => {
    try {
      const html = marked(text)
      return <div dangerouslySetInnerHTML={{ __html: html }} />
    } catch (error) {
      console.error('Error parsing markdown:', error)
      return <Typography sx={{ whiteSpace: 'pre-wrap' }}>{text}</Typography>
    }
  }

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

  // Handle scroll events
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollHeight = container.scrollHeight
      const clientHeight = container.clientHeight

      // Show buttons if content is scrollable
      setShowScrollButtons(scrollHeight > clientHeight)
    }

    container.addEventListener('scroll', handleScroll)
    // Initial check
    handleScroll()

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

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
        },
        // Add styles for markdown content
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          mt: 2,
          mb: 1,
          fontWeight: 'bold',
          color: 'text.primary'
        },
        '& p': {
          mb: 1,
          lineHeight: 1.6
        },
        '& ul, & ol': {
          pl: 3,
          mb: 1
        },
        '& li': {
          mb: 0.5
        },
        '& code': {
          p: 0.5,
          borderRadius: 1,
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          fontFamily: 'monospace'
        },
        '& pre': {
          p: 2,
          borderRadius: 1,
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          overflow: 'auto'
        },
        '& blockquote': {
          borderLeft: '4px solid',
          borderColor: 'primary.main',
          pl: 2,
          py: 0.5,
          my: 1,
          bgcolor: 'rgba(255, 255, 255, 0.05)'
        },
        '& a': {
          color: 'primary.main',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline'
          }
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
              }}
            >
              {renderMarkdown(content.text)}
            </Box>
          )
        })}
      </Box>
    )
  }

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      <Box 
        ref={containerRef}
        sx={{ 
          height: '100%', 
          overflow: 'auto',
          scrollBehavior: 'smooth'
        }}
      >
        {renderContent()}
      </Box>

      <Fade in={showScrollButtons}>
        <Box sx={{
          position: 'absolute',
          right: 2,
          bottom: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          zIndex: 1,
        }}>
          <IconButton
            onClick={scrollToTop}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': {
                bgcolor: 'background.paper',
                opacity: 0.9
              }
            }}
            size="small"
          >
            <KeyboardArrowUpIcon />
          </IconButton>
          <IconButton
            onClick={scrollToBottom}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': {
                bgcolor: 'background.paper',
                opacity: 0.9
              }
            }}
            size="small"
          >
            <KeyboardArrowDownIcon />
          </IconButton>
        </Box>
      </Fade>
    </Box>
  )
}

export default ResearchCanvas 