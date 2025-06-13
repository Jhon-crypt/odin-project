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

function ResearchTable() {
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
    <Paper
      sx={{
        bgcolor: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: 2,
        overflow: 'hidden',
        width: '100%',
        maxWidth: 'none',
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: { xs: 1.5, sm: 2, md: 3 }, 
        borderBottom: '1px solid #333' 
      }}>
        <Typography
          variant="h6"
          sx={{
            color: '#fff',
            fontWeight: 'bold',
            fontSize: { xs: '14px', sm: '16px', md: '18px' },
            mb: { xs: 0.5, sm: 1 },
          }}
        >
          Research Projects
        </Typography>
        <Typography
          sx={{
            color: '#888',
            fontSize: { xs: '12px', sm: '13px', md: '14px' },
          }}
        >
          {researchProjects.length} active projects and papers
        </Typography>
      </Box>

      {/* Table */}
      <TableContainer sx={{ overflow: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ 
                color: '#888', 
                borderBottom: '1px solid #333', 
                fontSize: { xs: '10px', sm: '11px', md: '12px' },
                py: { xs: 1, sm: 1.5 },
                px: { xs: 1.5, sm: 2, md: 3 },
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}>
                Project
              </TableCell>
              <TableCell sx={{ 
                color: '#888', 
                borderBottom: '1px solid #333', 
                fontSize: { xs: '10px', sm: '11px', md: '12px' },
                py: { xs: 1, sm: 1.5 },
                px: { xs: 1.5, sm: 2, md: 3 },
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                display: { xs: 'none', sm: 'table-cell' }
              }}>
                Last Updated
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
                <TableCell sx={{ 
                  borderBottom: '1px solid #333',
                  py: { xs: 1.5, sm: 2 },
                  px: { xs: 1.5, sm: 2, md: 3 },
                }}>
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
                
                <TableCell sx={{ 
                  borderBottom: '1px solid #333',
                  py: { xs: 1.5, sm: 2 },
                  px: { xs: 1.5, sm: 2, md: 3 },
                  display: { xs: 'none', sm: 'table-cell' }
                }}>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default ResearchTable 