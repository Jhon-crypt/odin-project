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
} from '@mui/material'
import {
  Search as SearchIcon,
  FolderOutlined as ProjectIcon,
  Add as AddIcon,
  SmartToy as LLMIcon,
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LLMModal from './LLMModal'
import UserProfile from './UserProfile'
import useLLMStore from '../store/llmStore'
import useProjectStore from '../store/projectStore'
import googleAIService from '../services/googleAIService'
import { supabase } from '../lib/supabaseClient'

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
  const { projects, isLoading, error, fetchProjects, createProject } = useProjectStore()
  const { selectedLLM, loadStoredSettings, initialized } = useLLMStore()

  // Load stored LLM settings when component mounts or auth state changes
  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (!initialized) {
          await loadStoredSettings()
        }
      } catch (error) {
        console.error('Error loading LLM settings:', error)
      }
    }

    // Initial load
    loadSettings()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        loadSettings()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [loadStoredSettings, initialized])

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
    console.log('Current project ID:', currentProjectId);
  }, [currentProjectId]);

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
                sx={{
                  borderRadius: '8px',
                  mx: 1,
                  py: { xs: 1, sm: 1.5 },
                  mb: 1,
                  bgcolor: project.id === currentProjectId ? '#C0FF92' : 'transparent',
                  color: project.id === currentProjectId ? '#000' : '#ccc',
                '&:hover': {
                    bgcolor: project.id === currentProjectId ? '#C0FF92' : '#333',
                },
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                }}
                onClick={() => handleProjectClick(project.id)}
            >
              <ListItemIcon sx={{ minWidth: { xs: 32, sm: 36 } }}>
                <ProjectIcon
                  sx={{
                      color: project.id === currentProjectId ? '#000' : '#888',
                    fontSize: { xs: 18, sm: 20 },
                  }}
                />
              </ListItemIcon>
              <ListItemText
                  primary={project.name}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: { xs: '14px', sm: '15px' },
                      fontWeight: project.id === currentProjectId ? 'bold' : 'normal',
                    },
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