import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  Search as SearchIcon,
  FolderOutlined as ProjectIcon,
  Add as AddIcon,
  SmartToy as LLMIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LLMModal from './LLMModal'
import UserProfile from './UserProfile'
import useLLMStore from '../store/llmStore'
import useProjectStore from '../store/projectStore'
import googleAIService from '../services/googleAIService'

const staticLLMOptions = [
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
]

function Sidebar() {
  const navigate = useNavigate()
  const { id: currentProjectId } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loadingModels, setLoadingModels] = useState(false)
  const [LLMOptions, setLLMOptions] = useState<Array<{ id: string; name: string; provider: string }>>(staticLLMOptions)
  const { projects, isLoading, error, fetchProjects, createProject, deleteProject } = useProjectStore()
  const { selectedLLM } = useLLMStore()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  // Fetch Google AI models when component mounts
  useEffect(() => {
    const fetchGoogleModels = async () => {
      setLoadingModels(true)
      try {
        const models = await googleAIService.fetchModels()
        const seenModelIds = new Set()
        const googleOptions = models
          // Include Gemini models but exclude vision models
          .filter(model => 
            model.name.includes('gemini') && 
            !model.name.toLowerCase().includes('vision')
          )
          .reduce<Array<{ id: string; name: string; provider: string }>>((unique, model) => {
            const modelId = model.name
            if (!seenModelIds.has(modelId)) {
              seenModelIds.add(modelId)
              unique.push({
                id: modelId,
                name: model.displayName || model.name,
                provider: 'Google'
              })
            }
            return unique
          }, [])
        
        console.log('Google models:', googleOptions) // For debugging
        setLLMOptions([...staticLLMOptions, ...googleOptions])
      } catch (error) {
        console.error('Error fetching Google AI models:', error)
      } finally {
        setLoadingModels(false)
      }
    }

    fetchGoogleModels()
  }, [])
  
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleAddProject = async () => {
    const newProjectId = await createProject()
    if (newProjectId) {
      navigate(`/projects/${newProjectId}`)
    }
  }

  const handleProjectClick = (projectId: string) => {
    // Simple navigation without any async operations
    navigate(`/projects/${projectId}`)
  }

  // Add debug logging
  useEffect(() => {
    console.log('Current project ID:', currentProjectId)
  }, [currentProjectId])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, projectId: string) => {
    event.stopPropagation()
    setSelectedProjectId(projectId)
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedProjectId(null)
  }

  const handleDeleteProject = async () => {
    if (selectedProjectId) {
      await deleteProject(selectedProjectId)
      handleMenuClose()
      // Refresh the projects list
      await fetchProjects()
    }
  }

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
            OdinX
          </Typography>
        </Box>
      </Box>

      {/* General Section */}
      <Box sx={{ overflow: 'auto' }}>
        <List sx={{ py: 0 }}>
          <ListItem
            onClick={() => navigate('/search')}
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
        </List>
      </Box>

      <Divider sx={{ borderColor: '#333', mx: 2, my: 1 }} />

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
          {isLoading ? (
            <ListItem
              sx={{
                borderRadius: '8px',
                mx: 1,
                py: { xs: 1, sm: 1.5 },
                mb: 1,
              }}
            >
              <CircularProgress size={20} sx={{ color: '#C0FF92' }} />
            </ListItem>
          ) : error ? (
            <ListItem
              sx={{
                borderRadius: '8px',
                mx: 1,
                py: { xs: 1, sm: 1.5 },
                mb: 1,
                color: 'error.main',
              }}
            >
              <ListItemText primary={error} />
            </ListItem>
          ) : projects.length === 0 ? (
            <ListItem
              sx={{
                borderRadius: '8px',
                mx: 1,
                py: { xs: 1, sm: 1.5 },
                mb: 1,
                color: '#888',
              }}
            >
              <Typography variant="body2">No projects yet</Typography>
            </ListItem>
          ) : (
            projects.map((project) => (
              <ListItem
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                sx={{
                  borderRadius: '8px',
                  mx: 1,
                  py: { xs: 1, sm: 1.5 },
                  mb: 1,
                  cursor: 'pointer',
                  bgcolor: project.id === currentProjectId ? '#333' : 'transparent',
                  '&:hover': {
                    bgcolor: project.id === currentProjectId ? '#333' : '#282828',
                    '& .project-menu': {
                      opacity: 1,
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: { xs: 32, sm: 36 } }}>
                  <ProjectIcon
                    sx={{
                      color: project.id === currentProjectId ? '#C0FF92' : '#888',
                      fontSize: { xs: 18, sm: 20 },
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={project.name}
                  primaryTypographyProps={{
                    fontSize: { xs: '13px', sm: '14px' },
                    color: project.id === currentProjectId ? '#fff' : '#ccc',
                  }}
                />
                <IconButton
                  className="project-menu"
                  size="small"
                  onClick={(e) => handleMenuOpen(e, project.id)}
                  sx={{
                    opacity: 0,
                    color: '#888',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  <MoreVertIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </ListItem>
            ))
          )}
        </List>

        <Button
          startIcon={<AddIcon />}
          onClick={handleAddProject}
          variant="outlined"
          fullWidth
          sx={{
            mt: 2,
            color: '#C0FF92',
            borderColor: '#C0FF92',
            '&:hover': {
              borderColor: '#d4ffb3',
              bgcolor: 'rgba(192, 255, 146, 0.1)',
            },
          }}
        >
          Add Project
        </Button>
      </Box>

      {/* Project Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            border: '1px solid #333',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <MenuItem
          onClick={handleDeleteProject}
          sx={{
            color: '#ff4444',
            '&:hover': {
              bgcolor: 'rgba(255, 68, 68, 0.1)',
            },
          }}
        >
          <DeleteIcon sx={{ fontSize: 20, mr: 1 }} />
          Delete Project
        </MenuItem>
      </Menu>

      <Divider sx={{ borderColor: '#333', mx: 2, my: 2 }} />

      {/* LLM Section */}
      <Box sx={{ px: { xs: 1, sm: 2 }, pb: 2 }}>
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
          Language Models
            </Typography>

        <Button
          startIcon={<LLMIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
          fullWidth
          variant="outlined"
          size="small"
          onClick={() => setIsModalOpen(true)}
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
          {selectedLLM ? LLMOptions.find(llm => llm.id === selectedLLM)?.name : 'Configure LLM'}
        </Button>
      </Box>

      {/* User Profile */}
      <UserProfile />

      {/* LLM Modal */}
      <LLMModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        loading={loadingModels}
        llmOptions={LLMOptions}
      />
    </Box>
  )
}

export default Sidebar 