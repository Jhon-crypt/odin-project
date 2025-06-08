import {
  Box,
  Typography,
  AvatarGroup,
  Avatar,
  Button,
} from '@mui/material'
import { Share as ShareIcon } from '@mui/icons-material'

interface ProjectHeaderProps {
  projectTitle: string
  projectSubtitle: string
}

function ProjectHeader({ projectTitle, projectSubtitle }: ProjectHeaderProps) {

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
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 1.5, md: 2 },
      }}
    >
      {/* Top Row - Title and Share */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
          mb: { xs: 1, md: 2 },
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#fff',
              mb: 0.5,
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
            }}
          >
            {projectTitle}
          </Typography>
          <Typography
            sx={{
              color: '#888',
              fontSize: { xs: '12px', sm: '13px', md: '14px' },
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {projectSubtitle}
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1.5, sm: 2 },
          flexDirection: { xs: 'row', sm: 'row' },
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'space-between', sm: 'flex-end' },
        }}>
          <AvatarGroup
            max={4}
            sx={{
              '& .MuiAvatar-root': {
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                border: '2px solid #333',
                fontSize: { xs: '10px', sm: '12px' },
              },
            }}
          >
            {teamMembers.map((avatar, index) => (
              <Avatar key={index} src={avatar} />
            ))}
          </AvatarGroup>

          <Button
            startIcon={<ShareIcon sx={{ fontSize: { xs: '16px', sm: '20px' } }} />}
            variant="outlined"
            size="small"
            sx={{
              borderColor: '#333',
              color: '#ccc',
              textTransform: 'none',
              fontSize: { xs: '12px', sm: '14px' },
              px: { xs: 2, sm: 3 },
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


    </Box>
  )
}

export default ProjectHeader 