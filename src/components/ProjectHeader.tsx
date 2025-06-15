import {
  Box,
  Typography,
  Button,
  IconButton,
  useMediaQuery,
  TextField,
} from '@mui/material'
import { Share as ShareIcon, Menu as MenuIcon, Description as DescriptionIcon, Edit as EditIcon } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import useProjectStore from '../store/projectStore'

interface ProjectHeaderProps {
  projectId?: string
  projectTitle: string
  projectSubtitle: string
  onLeftMenuClick?: () => void
  onRightMenuClick?: () => void
}

function ProjectHeader({ 
  projectId,
  projectTitle, 
  projectSubtitle, 
  onLeftMenuClick, 
  onRightMenuClick 
}: ProjectHeaderProps) {
  const isMobile = useMediaQuery('(max-width:767px)')
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(projectTitle)
  const { updateProject } = useProjectStore()

  // Update editedTitle when projectTitle changes
  useEffect(() => {
    setEditedTitle(projectTitle)
  }, [projectTitle])

  const handleStartEditing = () => {
    setEditedTitle(projectTitle)
    setIsEditing(true)
  }

  const handleSave = async () => {
    const trimmedTitle = editedTitle.trim()
    if (projectId && trimmedTitle !== '' && trimmedTitle !== projectTitle) {
      try {
        await updateProject(projectId, trimmedTitle)
      } catch (error) {
        console.error('Failed to update project title:', error)
        // Revert to original title on error
        setEditedTitle(projectTitle)
      }
    } else {
      // If empty or unchanged, revert to original title
      setEditedTitle(projectTitle)
    }
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setEditedTitle(projectTitle)
    }
  }

  const renderTitle = () => {
    if (isEditing) {
      return (
        <TextField
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyPress}
          autoFocus
          size="small"
          sx={{
            '& .MuiInputBase-input': {
              color: '#fff',
              fontSize: { xs: '16px', sm: '18px' },
              fontWeight: 'bold',
              padding: '4px 8px',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#333',
              },
              '&:hover fieldset': {
                borderColor: '#C0FF92',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#C0FF92',
              },
            },
          }}
        />
      )
    }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: '#fff',
            fontSize: { xs: '16px', sm: '18px' },
            mb: 0.5,
            lineHeight: 1.2,
          }}
        >
          {projectTitle}
        </Typography>
        {projectId && (
          <IconButton
            onClick={handleStartEditing}
            size="small"
            sx={{
              color: '#888',
              '&:hover': {
                color: '#C0FF92',
              },
            }}
          >
            <EditIcon sx={{ fontSize: '16px' }} />
          </IconButton>
        )}
      </Box>
    )
  }

  return (
    <Box
      sx={{
        borderBottom: '1px solid #333',
        bgcolor: '#111111',
        px: { xs: 2, sm: 2, md: 3, lg: 4 },
        py: { xs: 2, sm: 1.5, md: 2 },
        width: '100%',
        flexShrink: 0,
        mt: { xs: 1, sm: 0 },
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Mobile Layout */}
      {isMobile ? (
        <Box sx={{ 
          pt: { xs: 1, sm: 0 },
          px: { xs: 1, sm: 0 },
        }}>
          {/* Title and Subtitle */}
          <Box sx={{ mb: 1.5 }}>
            {renderTitle()}
            <Typography
              sx={{
                color: '#888',
                fontSize: { xs: '11px', sm: '12px' },
                lineHeight: 1.3,
                pr: { xs: 2, sm: 0 },
              }}
            >
              {projectSubtitle}
            </Typography>
          </Box>

          {/* Menu Buttons and Share Button */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {/* Left side: Menu Buttons */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flex: 1,
              }}
            >
              <IconButton
                onClick={onLeftMenuClick}
                sx={{
                  bgcolor: '#1a1a1a',
                  color: '#C0FF92',
                  border: '1px solid #333',
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                  '&:hover': {
                    bgcolor: '#333',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <MenuIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
              </IconButton>

              <IconButton
                onClick={onRightMenuClick}
                sx={{
                  bgcolor: '#1a1a1a',
                  color: '#C0FF92',
                  border: '1px solid #333',
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                  mr: 0.5,
                  '&:hover': {
                    bgcolor: '#333',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <DescriptionIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
              </IconButton>
            </Box>

            {/* Right side: Share Button */}
            <Button
              startIcon={<ShareIcon sx={{ fontSize: { xs: 12, sm: 14 } }} />}
              variant="outlined"
              size="small"
              sx={{
                borderColor: '#333',
                color: '#ccc',
                textTransform: 'none',
                fontSize: { xs: '10px', sm: '11px' },
                minWidth: 'auto',
                px: { xs: 1, sm: 1.5 },
                py: { xs: 0.5, sm: 0.75 },
                minHeight: { xs: '28px', sm: '32px' },
                flexShrink: 0,
                '&:hover': {
                  borderColor: '#C0FF92',
                  color: '#C0FF92',
                  bgcolor: 'rgba(192, 255, 146, 0.1)',
                },
              }}
            >
              Share
            </Button>
          </Box>
        </Box>
      ) :
        /* Desktop/Tablet Layout */
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ flex: 1 }}>
            {renderTitle()}
            <Typography
              sx={{
                color: '#888',
                fontSize: { sm: '12px', md: '13px', lg: '14px' },
              }}
            >
              {projectSubtitle}
            </Typography>
          </Box>

          <Button
            startIcon={<ShareIcon sx={{ fontSize: { sm: 16, md: 20 } }} />}
            variant="outlined"
            size="small"
            sx={{
              borderColor: '#333',
              color: '#ccc',
              textTransform: 'none',
              fontSize: { sm: '12px', md: '14px' },
              px: { sm: 2, md: 3 },
              '&:hover': {
                borderColor: '#C0FF92',
                color: '#C0FF92',
                bgcolor: 'rgba(192, 255, 146, 0.1)',
              },
            }}
          >
            Share
          </Button>
        </Box>
      }
    </Box>
  )
}

export default ProjectHeader 