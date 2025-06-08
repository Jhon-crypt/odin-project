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
        px: 4,
        py: 2,
      }}
    >
      {/* Top Row - Title and Share */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#fff',
              mb: 0.5,
            }}
          >
            {projectTitle}
          </Typography>
          <Typography
            sx={{
              color: '#888',
              fontSize: '14px',
            }}
          >
            {projectSubtitle}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AvatarGroup
            max={4}
            sx={{
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                border: '2px solid #333',
                fontSize: '12px',
              },
            }}
          >
            {teamMembers.map((avatar, index) => (
              <Avatar key={index} src={avatar} />
            ))}
          </AvatarGroup>

          <Button
            startIcon={<ShareIcon />}
            variant="outlined"
            sx={{
              borderColor: '#333',
              color: '#ccc',
              textTransform: 'none',
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