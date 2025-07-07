import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Launch as LaunchIcon } from '@mui/icons-material'

interface ResearchProject {
  id: string
  title: string
  type: 'paper' | 'project' | 'collaboration'
  lastUpdated: string
  status: 'published' | 'in-review' | 'draft' | 'active'
  collaborators: string[]
}

interface ResearchTableProps {
  userId?: string;
}

function ResearchTable({ userId }: ResearchTableProps) {
  const navigate = useNavigate()
  
  const researchProjects: ResearchProject[] = [
    {
      id: '1',
      title: 'Spaceship Crew Psychology Analysis',
      type: 'project',
      lastUpdated: 'December 15, 2024',
      status: 'active',
      collaborators: ['Emily Liu', 'Marcus Chen'],
    },
    {
      id: '2',
      title: 'Machine Learning in Space Exploration',
      type: 'paper',
      lastUpdated: 'December 10, 2024',
      status: 'in-review',
      collaborators: ['Sarah Johnson'],
    },
    {
      id: '3',
      title: 'AI-Powered Research Assistant Development',
      type: 'collaboration',
      lastUpdated: 'December 8, 2024',
      status: 'published',
      collaborators: ['Alex Rodriguez', 'Maya Patel'],
    },
    {
      id: '4',
      title: 'Deep Learning for Scientific Literature Analysis',
      type: 'paper',
      lastUpdated: 'December 5, 2024',
      status: 'draft',
      collaborators: ['David Kim'],
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'paper':
        return '📄'
      case 'project':
        return '🔬'
      case 'collaboration':
        return '🤝'
      default:
        return '📄'
    }
  }

  return (
    <Box
      sx={{
        bgcolor: '#1a1a1a',
        borderRadius: 2,
        p: { xs: 2, sm: 3 },
        border: '1px solid #333',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: '#fff',
          fontWeight: 'bold',
          fontSize: { xs: '14px', sm: '16px', md: '18px' },
          mb: 2,
        }}
      >
        Research Projects
      </Typography>

      <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: '#888',
                  borderBottom: '1px solid #333',
                  fontSize: { xs: '12px', sm: '13px' },
                  py: 1.5,
                }}
              >
                Title
              </TableCell>
              <TableCell
                sx={{
                  color: '#888',
                  borderBottom: '1px solid #333',
                  fontSize: { xs: '12px', sm: '13px' },
                  py: 1.5,
                }}
              >
                Type
              </TableCell>
              <TableCell
                sx={{
                  color: '#888',
                  borderBottom: '1px solid #333',
                  fontSize: { xs: '12px', sm: '13px' },
                  py: 1.5,
                }}
              >
                Last Updated
              </TableCell>
              <TableCell
                sx={{
                  color: '#888',
                  borderBottom: '1px solid #333',
                  fontSize: { xs: '12px', sm: '13px' },
                  py: 1.5,
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  color: '#888',
                  borderBottom: '1px solid #333',
                  fontSize: { xs: '12px', sm: '13px' },
                  py: 1.5,
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {researchProjects.map((project) => (
              <TableRow
                key={project.id}
                sx={{
                  '&:hover': {
                    bgcolor: '#222',
                  },
                  '&:last-child td': {
                    borderBottom: 'none',
                  }
                }}
              >
                <TableCell
                  sx={{
                    color: '#fff',
                    borderBottom: '1px solid #333',
                    fontSize: { xs: '13px', sm: '14px' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                    <Typography sx={{ 
                      fontSize: { xs: '16px', sm: '18px', md: '20px' },
                      flexShrink: 0,
                    }}>
                      {getTypeIcon(project.type)}
                    </Typography>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Button
                        onClick={() => navigate(`/research/${project.id}`)}
                        sx={{
                          color: '#fff',
                          fontSize: { xs: '12px', sm: '13px', md: '14px' },
                          fontWeight: 'medium',
                          lineHeight: 1.3,
                          mb: { xs: 0.5, sm: 0.75 },
                          textAlign: 'left',
                          p: 0,
                          '&:hover': {
                            color: '#C0FF92',
                            bgcolor: 'transparent',
                          },
                          width: '100%',
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                        }}
                        endIcon={
                          <LaunchIcon sx={{ 
                            fontSize: { xs: 14, sm: 16 },
                            opacity: 0.5,
                            ml: 1,
                          }} />
                        }
                      >
                        {project.title}
                      </Button>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: { xs: 0.25, sm: 2 }
                      }}>
                        <Typography
                          sx={{
                            color: '#888',
                            fontSize: { xs: '10px', sm: '11px', md: '12px' },
                            textTransform: 'capitalize',
                            fontWeight: '500',
                          }}
                        >
                          {project.type}
                        </Typography>
                        <Typography
                          sx={{
                            color: '#ccc',
                            fontSize: { xs: '10px', sm: '11px', md: '12px' },
                            display: { xs: 'block', sm: 'none' }
                          }}
                        >
                          {project.lastUpdated}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </TableCell>
                
                <TableCell
                  sx={{
                    color: '#ccc',
                    borderBottom: '1px solid #333',
                    fontSize: { xs: '12px', sm: '13px' },
                  }}
                >
                  <Typography
                    sx={{
                      color: '#ccc',
                      fontSize: { xs: '11px', sm: '12px', md: '13px' },
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {project.lastUpdated}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: '1px solid #333',
                  }}
                >
                  <Box
                    sx={{
                      display: 'inline-block',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: { xs: '11px', sm: '12px' },
                      fontWeight: 'medium',
                      bgcolor: project.status === 'active' ? '#C0FF92' : '#ccc',
                      color: project.status === 'active' ? '#000' : '#888',
                    }}
                  >
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: '1px solid #333',
                  }}
                >
                  <Button
                    startIcon={<LaunchIcon />}
                    size="small"
                    onClick={() => navigate(`/research/${project.id}`)}
                    sx={{
                      color: '#ccc',
                      textTransform: 'none',
                      fontSize: { xs: '12px', sm: '13px' },
                      '&:hover': {
                        color: '#C0FF92',
                      },
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default ResearchTable 