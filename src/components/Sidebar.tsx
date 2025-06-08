import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
  Divider,
} from '@mui/material'
import {
  Search as SearchIcon,
  CreditCard as BillingIcon,
  Folder as ProjectIcon,
  Add as AddIcon,
  Person as PersonIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

interface SidebarProps {
  activeProject: string
}

function Sidebar({ activeProject }: SidebarProps) {
  const navigate = useNavigate()
  
  const projects = [
    'AI Research Papers',
    'Machine Learning Studies',
    'Data Science Analysis',
    'Neural Networks',
    'Computer Vision',
  ]

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        bgcolor: '#1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #333',
        overflow: 'hidden',
      }}
    >
      {/* Logo & Workspace */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          borderBottom: '1px solid #333',
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontSize: { xs: '20px', sm: '24px' } }}>🔬</Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#fff',
              fontSize: { xs: '16px', sm: '18px' },
            }}
          >
            Odin Research
          </Typography>
        </Box>
      </Box>

      {/* General Section */}
      <Box sx={{ px: { xs: 1, sm: 2 }, py: { xs: 2, sm: 3 }, flexShrink: 0 }}>
        <Typography
          variant="caption"
          sx={{
            color: '#888',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 1,
            px: 2,
            mb: 1,
            display: 'block',
            fontSize: { xs: '10px', sm: '11px' },
          }}
        >
          General
        </Typography>
        
        <List sx={{ p: 0 }}>
          <ListItem
            sx={{
              borderRadius: '8px',
              mx: 1,
              py: { xs: 1, sm: 1.5 },
              '&:hover': {
                bgcolor: '#333',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: { xs: 32, sm: 36 } }}>
              <SearchIcon sx={{ color: '#888', fontSize: { xs: 18, sm: 20 } }} />
            </ListItemIcon>
            <ListItemText
              primary="Search"
              primaryTypographyProps={{
                fontSize: { xs: '13px', sm: '14px' },
                color: '#ccc',
              }}
            />
          </ListItem>
          
          <ListItem
            sx={{
              borderRadius: '8px',
              mx: 1,
              py: { xs: 1, sm: 1.5 },
              '&:hover': {
                bgcolor: '#333',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: { xs: 32, sm: 36 } }}>
              <BillingIcon sx={{ color: '#888', fontSize: { xs: 18, sm: 20 } }} />
            </ListItemIcon>
            <ListItemText
              primary="Billing"
              primaryTypographyProps={{
                fontSize: { xs: '13px', sm: '14px' },
                color: '#ccc',
              }}
            />
          </ListItem>

          <ListItem
            onClick={() => navigate('/profile')}
            sx={{
              borderRadius: '8px',
              mx: 1,
              py: { xs: 1, sm: 1.5 },
              cursor: 'pointer',
              '&:hover': {
                bgcolor: '#333',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: { xs: 32, sm: 36 } }}>
              <PersonIcon sx={{ color: '#888', fontSize: { xs: 18, sm: 20 } }} />
            </ListItemIcon>
            <ListItemText
              primary="Profile"
              primaryTypographyProps={{
                fontSize: { xs: '13px', sm: '14px' },
                color: '#ccc',
              }}
            />
          </ListItem>
        </List>
      </Box>

      <Divider sx={{ borderColor: '#333', mx: 2 }} />

      {/* Projects Section */}
      <Box sx={{ px: { xs: 1, sm: 2 }, py: { xs: 2, sm: 3 }, flex: 1, overflow: 'auto' }}>
        <Typography
          variant="caption"
          sx={{
            color: '#888',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 1,
            px: 2,
            mb: 1,
            display: 'block',
            fontSize: { xs: '10px', sm: '11px' },
          }}
        >
          Projects
        </Typography>
        
        <List sx={{ p: 0 }}>
          {projects.map((project, index) => (
            <ListItem
              key={index}
              sx={{
                borderRadius: '8px',
                mx: 1,
                py: { xs: 1, sm: 1.5 },
                bgcolor: project === activeProject ? '#C0FF92' : 'transparent',
                color: project === activeProject ? '#000' : '#ccc',
                '&:hover': {
                  bgcolor: project === activeProject ? '#C0FF92' : '#333',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: { xs: 32, sm: 36 } }}>
                <ProjectIcon
                  sx={{
                    color: project === activeProject ? '#000' : '#888',
                    fontSize: { xs: 18, sm: 20 },
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={project}
                primaryTypographyProps={{
                  fontSize: { xs: '13px', sm: '14px' },
                  fontWeight: project === activeProject ? 'bold' : 'normal',
                }}
              />
            </ListItem>
          ))}
        </List>

        {/* Add Project Button */}
        <Box sx={{ mt: 2, px: 1 }}>
          <Button
            startIcon={<AddIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
            fullWidth
            variant="outlined"
            size="small"
            sx={{
              borderColor: '#333',
              color: '#ccc',
              textTransform: 'none',
              justifyContent: 'flex-start',
              fontSize: { xs: '13px', sm: '14px' },
              py: { xs: 1, sm: 1.5 },
              '&:hover': {
                borderColor: '#C0FF92',
                color: '#C0FF92',
                bgcolor: 'rgba(192, 255, 146, 0.1)',
              },
            }}
          >
            Add Project
          </Button>
        </Box>
      </Box>

      {/* User Profile at Bottom */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          borderTop: '1px solid #333',
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: { xs: 32, sm: 36 },
              height: { xs: 32, sm: 36 },
              bgcolor: '#C0FF92',
              color: '#000',
              fontSize: { xs: '12px', sm: '14px' },
              fontWeight: 'bold',
            }}
          >
            EL
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                color: '#fff',
                fontSize: { xs: '13px', sm: '14px' },
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              Emily Liu
            </Typography>
            <Typography
              sx={{
                color: '#888',
                fontSize: { xs: '11px', sm: '12px' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              emily@research.ai
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Sidebar 