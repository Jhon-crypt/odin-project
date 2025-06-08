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
        width: { xs: '100vw', sm: 320, md: 280, lg: 280 },
        height: '100vh',
        bgcolor: '#1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #333',
        position: { xs: 'fixed', md: 'static' },
        top: 0,
        left: 0,
        zIndex: { xs: 1000, md: 'auto' },
      }}
    >
      {/* Logo & Workspace */}
      <Box
        sx={{
          p: 3,
          borderBottom: '1px solid #333',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontSize: '24px' }}>🔬</Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#fff',
            }}
          >
            Odin Research
          </Typography>
        </Box>
      </Box>

      {/* General Section */}
      <Box sx={{ px: 2, py: 3 }}>
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
          }}
        >
          General
        </Typography>
        
        <List sx={{ p: 0 }}>
          <ListItem
            sx={{
              borderRadius: '8px',
              mx: 1,
              '&:hover': {
                bgcolor: '#333',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <SearchIcon sx={{ color: '#888', fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText
              primary="Search"
              primaryTypographyProps={{
                fontSize: '14px',
                color: '#ccc',
              }}
            />
          </ListItem>
          
          <ListItem
            sx={{
              borderRadius: '8px',
              mx: 1,
              '&:hover': {
                bgcolor: '#333',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <BillingIcon sx={{ color: '#888', fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText
              primary="Billing"
              primaryTypographyProps={{
                fontSize: '14px',
                color: '#ccc',
              }}
            />
          </ListItem>

          <ListItem
            onClick={() => navigate('/profile')}
            sx={{
              borderRadius: '8px',
              mx: 1,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: '#333',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <PersonIcon sx={{ color: '#888', fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText
              primary="Profile"
              primaryTypographyProps={{
                fontSize: '14px',
                color: '#ccc',
              }}
            />
          </ListItem>
        </List>
      </Box>

      <Divider sx={{ borderColor: '#333', mx: 2 }} />

      {/* Projects Section */}
      <Box sx={{ px: 2, py: 3, flex: 1 }}>
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
                bgcolor: project === activeProject ? '#C0FF92' : 'transparent',
                color: project === activeProject ? '#000' : '#ccc',
                '&:hover': {
                  bgcolor: project === activeProject ? '#C0FF92' : '#333',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <ProjectIcon
                  sx={{
                    color: project === activeProject ? '#000' : '#888',
                    fontSize: 20,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={project}
                primaryTypographyProps={{
                  fontSize: '14px',
                  fontWeight: project === activeProject ? 'bold' : 'normal',
                }}
              />
            </ListItem>
          ))}
        </List>

        {/* Add New Project Button */}
        <Button
          startIcon={<AddIcon />}
          sx={{
            mt: 2,
            mx: 1,
            color: '#888',
            justifyContent: 'flex-start',
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#333',
              color: '#C0FF92',
            },
          }}
          fullWidth
        >
          Add new project
        </Button>
      </Box>

      {/* Current User Profile */}
      <Box
        sx={{
          p: 3,
          borderTop: '1px solid #333',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: '#C0FF92',
            color: '#000',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          JD
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              color: '#fff',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            John Doe
          </Typography>
          <Typography
            sx={{
              color: '#888',
              fontSize: '12px',
            }}
          >
            john@example.com
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Sidebar 