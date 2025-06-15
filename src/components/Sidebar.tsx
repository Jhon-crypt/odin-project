import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
  Skeleton,
} from '@mui/material'
import {
  Search as SearchIcon,
  Folder as ProjectIcon,
  Add as AddIcon,
  SmartToy as LLMIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LLMModal from './LLMModal'
import UserProfile from './UserProfile'
import useLLMStore from '../store/llmStore'
import useProjectStore from '../store/projectStore'
import googleAIService from '../services/googleAIService'
import type { Model } from '../types/models'

interface SidebarProps {
  activeProject: string
}

interface LLMOption {
  id: string;
  name: string;
  provider: string;
}

// Static LLM options for OpenAI and Anthropic
const staticLLMOptions: LLMOption[] = [
  // Removed OpenAI and Anthropic models - only using Google models
]

function Sidebar({ activeProject }: SidebarProps) {
  const navigate = useNavigate()
  const [isLLMModalOpen, setIsLLMModalOpen] = useState(false)
  const { selectedLLM } = useLLMStore()
  const { projects, loading, error, fetchProjects, createProject } = useProjectStore()
  const [llmOptions, setLLMOptions] = useState(staticLLMOptions)
  const [loadingModels, setLoadingModels] = useState(false)
  
  const selectedLLMDetails = llmOptions.find(llm => llm.id === selectedLLM)

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
          {loading ? (
            // Loading skeletons
            [...Array(3)].map((_, index) => (
              <ListItem
                key={index}
                sx={{
                  borderRadius: '8px',
                  mx: 1,
                  py: { xs: 1, sm: 1.5 },
                }}
              >
                <ListItemIcon sx={{ minWidth: { xs: 32, sm: 36 } }}>
                  <Skeleton variant="circular" width={20} height={20} />
                </ListItemIcon>
                <Skeleton variant="text" width="80%" height={24} />
              </ListItem>
            ))
          ) : error ? (
            <ListItem
              sx={{
                borderRadius: '8px',
                mx: 1,
                py: { xs: 1, sm: 1.5 },
                color: '#ff6b6b',
              }}
            >
              <Typography variant="body2">Failed to load projects</Typography>
            </ListItem>
          ) : projects.length === 0 ? (
            <ListItem
              sx={{
                borderRadius: '8px',
                mx: 1,
                py: { xs: 1, sm: 1.5 },
                color: '#888',
              }}
            >
              <Typography variant="body2">No projects yet</Typography>
            </ListItem>
          ) : (
            projects.map((project) => (
              <ListItem
                key={project.id}
                sx={{
                  borderRadius: '8px',
                  mx: 1,
                  py: { xs: 1, sm: 1.5 },
                  bgcolor: project.name === activeProject ? '#C0FF92' : 'transparent',
                  color: project.name === activeProject ? '#000' : '#ccc',
                  '&:hover': {
                    bgcolor: project.name === activeProject ? '#C0FF92' : '#333',
                  },
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <ListItemIcon sx={{ minWidth: { xs: 32, sm: 36 } }}>
                  <ProjectIcon
                    sx={{
                      color: project.name === activeProject ? '#000' : '#888',
                      fontSize: { xs: 18, sm: 20 },
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={project.name}
                  primaryTypographyProps={{
                    fontSize: { xs: '13px', sm: '14px' },
                    fontWeight: project.name === activeProject ? 'bold' : 'normal',
                  }}
                />
              </ListItem>
            ))
          )}
        </List>

        {/* Add Project Button */}
        <Box sx={{ mt: 2, px: 1 }}>
          <Button
            startIcon={<AddIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
            fullWidth
            variant="outlined"
            size="small"
            onClick={handleAddProject}
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
          onClick={() => setIsLLMModalOpen(true)}
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
          {selectedLLM ? selectedLLMDetails?.name : 'Configure LLM'}
        </Button>
      </Box>

      {/* User Profile */}
      <UserProfile />

      {/* LLM Modal */}
      <LLMModal
        open={isLLMModalOpen}
        onClose={() => setIsLLMModalOpen(false)}
        llmOptions={llmOptions}
        loading={loadingModels}
      />
    </Box>
  )
}

export default Sidebar 