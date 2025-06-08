import {
  Box,
  Typography,
  Avatar,
  Paper,
  Chip,
  Button,
  Divider,
  IconButton,
  Stack,
} from '@mui/material'
import {
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Description as DocumentIcon,
  Visibility as ViewIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface ResearchDocument {
  id: string
  title: string
  description: string
  lastModified: string
  wordCount: number
  tags: string[]
  status: 'draft' | 'in-progress' | 'completed'
}

function Profile() {
  const navigate = useNavigate()
  
  const [userProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?img=8',
    joinDate: 'January 2024',
    totalDocuments: 12,
    totalWords: 45680,
    researchAreas: ['Space Psychology', 'Team Dynamics', 'AI Research', 'Human Factors'],
  })

  const [researchDocuments] = useState<ResearchDocument[]>([
    {
      id: '1',
      title: 'Spaceship Crew Psychology Analysis',
      description: 'Comprehensive analysis of psychological dynamics, leadership structures, and team cohesion strategies for long-duration Mars missions.',
      lastModified: '2 hours ago',
      wordCount: 3420,
      tags: ['Psychology', 'Space', 'Leadership'],
      status: 'in-progress',
    },
    {
      id: '2',
      title: 'AI Ethics in Research Methodology',
      description: 'Exploring ethical considerations and best practices for AI-assisted research in academic and scientific contexts.',
      lastModified: '1 day ago',
      wordCount: 5680,
      tags: ['AI', 'Ethics', 'Research'],
      status: 'completed',
    },
    {
      id: '3',
      title: 'Human-Computer Interaction in Space',
      description: 'Study of interface design and interaction patterns for space mission control systems and crew interfaces.',
      lastModified: '3 days ago',
      wordCount: 2890,
      tags: ['HCI', 'Space', 'Interface'],
      status: 'draft',
    },
    {
      id: '4',
      title: 'Team Communication Protocols',
      description: 'Analysis of communication strategies and protocols for distributed teams in high-stress environments.',
      lastModified: '1 week ago',
      wordCount: 4250,
      tags: ['Communication', 'Teams', 'Protocols'],
      status: 'completed',
    },
    {
      id: '5',
      title: 'Cognitive Load in Mission Planning',
      description: 'Research on cognitive workload and decision-making processes during complex mission planning scenarios.',
      lastModified: '2 weeks ago',
      wordCount: 3670,
      tags: ['Cognition', 'Planning', 'Decision Making'],
      status: 'in-progress',
    },
    {
      id: '6',
      title: 'Virtual Reality Training Systems',
      description: 'Evaluation of VR-based training effectiveness for astronaut preparation and skill development.',
      lastModified: '1 month ago',
      wordCount: 4890,
      tags: ['VR', 'Training', 'Simulation'],
      status: 'completed',
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#C0FF92'
      case 'in-progress':
        return '#FFB347'
      case 'draft':
        return '#87CEEB'
      default:
        return '#888'
    }
  }

  const handleViewDocument = () => {
    // For now, navigate to dashboard - in the future, this could open a specific document
    navigate('/dashboard')
  }

  const handleEditProfile = () => {
    // Profile editing functionality would go here
    console.log('Edit profile clicked')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#111111',
        color: '#fff',
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Profile Header */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: 3,
          p: { xs: 3, md: 4 },
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 3,
          }}
        >
          <Avatar
            src={userProfile.avatar}
            sx={{
              width: { xs: 80, md: 100 },
              height: { xs: 80, md: 100 },
              border: '3px solid #C0FF92',
            }}
          />
          
          <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: { xs: 'center', sm: 'flex-start' }, mb: 2 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '1.75rem', md: '2.125rem' },
                }}
              >
                {userProfile.name}
              </Typography>
              <IconButton
                onClick={handleEditProfile}
                sx={{
                  color: '#C0FF92',
                  bgcolor: '#333',
                  '&:hover': {
                    bgcolor: '#444',
                  },
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Box>
            
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                <EmailIcon sx={{ color: '#888', fontSize: 18 }} />
                <Typography sx={{ color: '#ccc', fontSize: '14px' }}>
                  {userProfile.email}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                <CalendarIcon sx={{ color: '#888', fontSize: 18 }} />
                <Typography sx={{ color: '#ccc', fontSize: '14px' }}>
                  Joined {userProfile.joinDate}
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ display: 'flex', gap: 4, justifyContent: { xs: 'center', sm: 'flex-start' }, mb: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#C0FF92', fontWeight: 'bold' }}>
                  {userProfile.totalDocuments}
                </Typography>
                <Typography sx={{ color: '#888', fontSize: '12px' }}>
                  Documents
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#C0FF92', fontWeight: 'bold' }}>
                  {userProfile.totalWords.toLocaleString()}
                </Typography>
                <Typography sx={{ color: '#888', fontSize: '12px' }}>
                  Words Written
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography sx={{ color: '#888', fontSize: '12px', mb: 1 }}>
                Research Areas
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                {userProfile.researchAreas.map((area) => (
                  <Chip
                    key={area}
                    label={area}
                    size="small"
                    sx={{
                      bgcolor: '#333',
                      color: '#ccc',
                      border: '1px solid #444',
                      fontSize: '11px',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Research Documents */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <DocumentIcon sx={{ color: '#C0FF92' }} />
          My Research Documents
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {researchDocuments.map((doc) => (
            <Paper
              key={doc.id}
              elevation={0}
              sx={{
                bgcolor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: 2,
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#C0FF92',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(192, 255, 146, 0.1)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Chip
                  label={doc.status}
                  size="small"
                  sx={{
                    bgcolor: 'transparent',
                    border: `1px solid ${getStatusColor(doc.status)}`,
                    color: getStatusColor(doc.status),
                    fontSize: '10px',
                    textTransform: 'capitalize',
                  }}
                />
                <Typography sx={{ color: '#666', fontSize: '11px' }}>
                  {doc.wordCount} words
                </Typography>
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: '16px',
                  lineHeight: 1.3,
                }}
              >
                {doc.title}
              </Typography>

              <Typography
                sx={{
                  color: '#ccc',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  mb: 3,
                  flex: 1,
                }}
              >
                {doc.description}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 3 }}>
                {doc.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      bgcolor: '#333',
                      color: '#888',
                      fontSize: '10px',
                      height: 20,
                    }}
                  />
                ))}
              </Box>

              <Divider sx={{ borderColor: '#333', mb: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: '#666', fontSize: '11px' }}>
                  {doc.lastModified}
                </Typography>
                <Button
                  startIcon={<ViewIcon />}
                  onClick={() => handleViewDocument()}
                  size="small"
                  sx={{
                    color: '#C0FF92',
                    textTransform: 'none',
                    fontSize: '11px',
                    '&:hover': {
                      bgcolor: 'rgba(192, 255, 146, 0.1)',
                    },
                  }}
                >
                  View
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Back to Dashboard */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          onClick={() => navigate('/dashboard')}
          variant="outlined"
          sx={{
            borderColor: '#333',
            color: '#C0FF92',
            textTransform: 'none',
            px: 4,
            py: 1.5,
            '&:hover': {
              borderColor: '#C0FF92',
              bgcolor: 'rgba(192, 255, 146, 0.1)',
            },
          }}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  )
}

export default Profile 