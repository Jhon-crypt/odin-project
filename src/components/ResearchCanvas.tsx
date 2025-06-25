import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Box, CircularProgress, IconButton, Typography, TextField, Button } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import useResearchStore from '../store/researchStore'
import useCanvasStore from '../store/canvasStore'
import type { TextContent } from '../types/models'
import ReactMarkdown from 'react-markdown'
import { supabase } from '../lib/supabaseClient'

const formatMarkdown = (text: string): string => {
  const lines = text.split('\n')
  let formattedLines = lines.map(line => {
    // Format headings (# Heading)
    if (line.match(/^#{1,6}\s/)) {
      return line // Already in correct format
    }
    // Format bold text that's not already marked
    if (line.match(/^[A-Z\s]+:/) && !line.includes('**')) {
      return `**${line.trim()}**`
    }
    // Format lists
    if (line.trim().match(/^\d+\./)) {
      return line // Already numbered list
    }
    if (line.trim().match(/^[-*]\s/)) {
      return line // Already bullet list
    }
    // Format links that aren't already formatted
    if (line.includes('http') && !line.includes('[') && !line.includes('](')) {
      return line.replace(/(https?:\/\/[^\s]+)/g, '[$1]($1)')
    }
    return line
  })

  // Handle multi-line formatting
  let inCodeBlock = false
  formattedLines = formattedLines.map((line, index) => {
    // Handle code blocks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      return line
    }
    if (inCodeBlock) {
      return line
    }

    // Add spacing between paragraphs
    const nextLine = formattedLines[index + 1]
    if (line.trim() && nextLine?.trim() && !line.endsWith('  ')) {
      return line + '  ' // Add markdown line break
    }
    return line
  })

  return formattedLines.join('\n')
}

interface CanvasItem {
  id: string
  project_id: string
  type: string
  content: {
    text: string
  }
  position: {
    x: number
    y: number
  }
  created_at: string
  created_by: string
}

export const ResearchCanvas: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const [localContent, setLocalContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [removingItems, setRemovingItems] = useState<Record<string, boolean>>({})
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([])

  const {
    isLoading: researchLoading,
    error: researchError,
    fetchDocument,
    updateContentWithDebounce,
    updateDocument,
    isEditing: researchIsEditing,
    setIsEditing: setResearchIsEditing,
    clearContent,
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

  const fetchDocumentSupabase = async () => {
    if (!projectId) return
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('Fetching document for project:', projectId)
      const { data: items, error: fetchError } = await supabase
        .from('canvas_items')
        .select('*')
        .eq('project_id', projectId)
        .eq('type', 'text')
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') { // Ignore "no rows returned" error
        console.error('Fetch error:', fetchError)
        throw fetchError
      }

      console.log('Fetched item:', items)

      if (items?.content?.text) {
        const textContent = items.content.text.trim()
        console.log('Setting content:', textContent)
        setContent(textContent)
      } else {
        console.log('No content found, setting empty string')
        setContent('')
      }
    } catch (error) {
      console.error('Error fetching document:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while fetching the document')
    } finally {
      setIsLoading(false)
    }
  }

  const updateDocumentSupabase = async (newContent: string) => {
    if (!projectId) return
    try {
      setIsLoading(true)
      setError(null)

      // Get current user
      const { data: user, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user?.user) throw new Error('User not authenticated')

      // Delete existing content first
      console.log('Deleting existing content for project:', projectId)
      const { error: deleteError } = await supabase
        .from('canvas_items')
        .delete()
        .eq('project_id', projectId)
        .eq('type', 'text')

      if (deleteError) throw deleteError

      // If content is empty, we're done
      if (!newContent.trim()) {
        console.log('Content is empty, clearing state')
        setContent('')
        return
      }

      // Create new content
      console.log('Creating new content:', newContent)
      const { data: newItem, error: createError } = await supabase
        .from('canvas_items')
        .insert({
          project_id: projectId,
          type: 'text',
          content: { text: newContent.trim() },
          position: { x: 0, y: 0 },
          created_by: user.user.id,
        })
        .select()
        .single()

      if (createError) throw createError

      console.log('Created new item:', newItem)
      if (newItem?.content?.text) {
        setContent(newItem.content.text)
      }
    } catch (error) {
      console.error('Error updating document:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while updating the document')
      // Refetch to ensure consistent state
      await fetchDocumentSupabase()
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log('ResearchCanvas mounted/updated with projectId:', projectId)
    if (projectId) {
      fetchDocumentSupabase()
      fetchItems(projectId)
    }
  }, [projectId])

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

  const handleContentChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = event.target.value
    setLocalContent(newContent)
    await updateDocumentSupabase(newContent)
  }

  const handleSave = () => {
    if (!projectId) return
    const formattedContent = formatText(localContent).map(block => {
      switch (block.type) {
        case 'heading':
          return block.content
        case 'subheading':
          return `* **${block.content}:**`
        default:
          return block.content
      }
    }).join('\n\n')
    
    updateDocument(projectId, formattedContent).then(() => {
      setIsEditing(false)
      fetchDocument(projectId)
    })
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const formatText = (text: string) => {
    return text
      .split('\n\n')
      .filter(para => para.trim())
      .map(paragraph => {
        if (paragraph.match(/^\*\*([^*]+)\*\*$/)) {
          return {
            type: 'heading',
            content: paragraph.replace(/^\*\*([^*]+)\*\*$/, '$1')
          }
        }
        if (paragraph.match(/^\* \*\*([^*]+)\*\*:/)) {
          return {
            type: 'subheading',
            content: paragraph.replace(/^\* \*\*([^*]+)\*\*:/, '$1')
          }
        }
        return {
          type: 'paragraph',
          content: paragraph.replace(/\*\*([^*]+)\*\*/g, '$1')
        }
      })
  }

  const handleClearContent = async () => {
    if (!projectId) return
    try {
      setIsLoading(true)
      setError(null)
      setLocalContent('')

      console.log('Clearing content for project:', projectId)
      const { error: deleteError } = await supabase
        .from('canvas_items')
        .delete()
        .eq('project_id', projectId)
        .eq('type', 'text')

      if (deleteError) throw deleteError
      setCanvasItems(prevItems => prevItems.filter(item => item.type !== 'text'))
      
      // Refetch to ensure we have the latest data
      await fetchDocumentSupabase()
    } catch (error) {
      console.error('Error clearing content:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while clearing the document')
      await fetchDocumentSupabase()
    } finally {
      setIsLoading(false)
    }
  }

  const renderContent = () => {
    if (!content && !localContent && items.length === 0) {
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
        <Box sx={{ position: 'relative' }}>
          <TextField
            fullWidth
            multiline
            value={localContent}
            onChange={handleContentChange}
            sx={{
              '& .MuiInputBase-root': {
                height: '80vh',
                alignItems: 'flex-start',
                padding: '16px',
                '& textarea': {
                  height: '100% !important',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }
              }
            }}
            placeholder="Start typing your research document here...
# Use markdown syntax for formatting:
# Heading 1
## Heading 2
**Bold text**
* Bullet point
1. Numbered list
```code block```
[Link text](url)"
          />
          <Box sx={{ position: 'absolute', top: -40, right: 0, display: 'flex', gap: 1 }}>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={handleClearContent}
              disabled={isLoading}
            >
              Clear
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSave}
              disabled={isLoading}
            >
              Done
            </Button>
          </Box>
        </Box>
      )
    }

    const formattedBlocks = formatText(content || '')
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
          {formattedBlocks.map((block, index) => {
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
          disabled={isLoading}
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
            gap: 2,
            p: 4,
          }}>
            <Typography color="error" align="center" sx={{ color: '#ff6b6b' }}>
              {error}
            </Typography>
            <IconButton
              onClick={() => {
                if (projectId) {
                  fetchDocumentSupabase()
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