import { useState } from 'react'
import {
  Box,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Skeleton,
} from '@mui/material'
import { MoreVert as MoreIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function UserProfile() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleProfile = () => {
    handleClose()
    navigate('/profile')
  }

  const handleSignOut = async () => {
    handleClose()
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!user) {
    return (
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="70%" height={24} />
          <Skeleton variant="text" width="90%" height={20} />
        </Box>
      </Box>
    )
  }

  // Get display name from user metadata or email
  const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User'
  const email = user.email

  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderTop: '1px solid #333',
      }}
    >
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: '#333',
          color: '#fff',
          fontSize: '16px',
        }}
      >
        {displayName.charAt(0).toUpperCase()}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontWeight: 'bold',
            color: '#fff',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {displayName}
        </Typography>
        <Typography
          sx={{
            color: '#888',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {email}
        </Typography>
      </Box>

      <IconButton
        onClick={handleClick}
        sx={{
          color: '#888',
          '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' },
        }}
      >
        <MoreIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            border: '1px solid #333',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            '& .MuiMenuItem-root': {
              fontSize: '14px',
              color: '#fff',
              '&:hover': {
                bgcolor: '#333',
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
      </Menu>
    </Box>
  )
} 