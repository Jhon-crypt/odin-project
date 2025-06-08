import {
  Box,
  Typography,
  AvatarGroup,
  Avatar,
  Button,
  useMediaQuery,
} from '@mui/material'
import { Share as ShareIcon } from '@mui/icons-material'

interface ProjectHeaderProps {
  projectTitle: string
  projectSubtitle: string
}

function ProjectHeader({ projectTitle, projectSubtitle }: ProjectHeaderProps) {
  const isMobile = useMediaQuery('(max-width:767px)')

  const teamMembers = [
    'https://i.pravatar.cc/150?img=1',
    'https://i.pravatar.cc/150?img=2',
    'https://i.pravatar.cc/150?img=3',
    'https://i.pravatar.cc/150?img=4',
  ]

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
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: '#fff',
                fontSize: { xs: '16px', sm: '18px' },
                mb: 0.5,
                lineHeight: 1.2,
                pr: { xs: 2, sm: 0 },
              }}
            >
              {projectTitle}
            </Typography>
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

          {/* Team and Share Button */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <AvatarGroup
              max={3}
              sx={{
                '& .MuiAvatar-root': {
                  width: { xs: 20, sm: 24 },
                  height: { xs: 20, sm: 24 },
                  border: '1.5px solid #333',
                  fontSize: { xs: '8px', sm: '10px' },
                },
              }}
            >
              {teamMembers.map((avatar, index) => (
                <Avatar key={index} src={avatar} />
              ))}
            </AvatarGroup>

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
      ) : (
        /* Desktop/Tablet Layout */
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: '#fff',
                mb: 0.5,
                fontSize: { sm: '1.25rem', md: '1.5rem', lg: '1.75rem' },
              }}
            >
              {projectTitle}
            </Typography>
            <Typography
              sx={{
                color: '#888',
                fontSize: { sm: '12px', md: '13px', lg: '14px' },
              }}
            >
              {projectSubtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { sm: 1.5, md: 2 },
            }}
          >
            <AvatarGroup
              max={4}
              sx={{
                '& .MuiAvatar-root': {
                  width: { sm: 28, md: 32 },
                  height: { sm: 28, md: 32 },
                  border: '2px solid #333',
                  fontSize: { sm: '10px', md: '12px' },
                },
              }}
            >
              {teamMembers.map((avatar, index) => (
                <Avatar key={index} src={avatar} />
              ))}
            </AvatarGroup>

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
        </Box>
      )}
    </Box>
  )
}

export default ProjectHeader 