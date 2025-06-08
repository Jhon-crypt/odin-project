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
  Avatar,
  Chip,
  Button,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'

interface ResearchProject {
  id: string
  title: string
  type: 'paper' | 'project' | 'collaboration'
  lastUpdated: string
  status: 'published' | 'in-review' | 'draft' | 'active'
  collaborators: string[]
}

function ResearchTable() {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return { bgcolor: '#C0FF92', color: '#000' }
      case 'in-review':
        return { bgcolor: '#FFB347', color: '#000' }
      case 'active':
        return { bgcolor: '#87CEEB', color: '#000' }
      case 'draft':
        return { bgcolor: '#666', color: '#fff' }
      default:
        return { bgcolor: '#666', color: '#fff' }
    }
  }

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
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid #333' }}>
        <Typography
          variant="h6"
          sx={{
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '18px',
            mb: 1,
          }}
        >
          Research Projects
        </Typography>
        <Typography
          sx={{
            color: '#888',
            fontSize: '14px',
          }}
        >
          {researchProjects.length} active projects and papers
        </Typography>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#888', borderBottom: '1px solid #333', fontSize: '12px' }}>
                Project
              </TableCell>
              <TableCell sx={{ color: '#888', borderBottom: '1px solid #333', fontSize: '12px' }}>
                Last Updated
              </TableCell>
              <TableCell sx={{ color: '#888', borderBottom: '1px solid #333', fontSize: '12px' }}>
                Collaborators
              </TableCell>
              <TableCell sx={{ color: '#888', borderBottom: '1px solid #333', fontSize: '12px' }}>
                Status
              </TableCell>
              <TableCell sx={{ color: '#888', borderBottom: '1px solid #333', fontSize: '12px' }}>
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
                }}
              >
                <TableCell sx={{ borderBottom: '1px solid #333' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: '20px' }}>
                      {getTypeIcon(project.type)}
                    </Typography>
                    <Box>
                      <Typography
                        sx={{
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: 'medium',
                          lineHeight: 1.3,
                        }}
                      >
                        {project.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#888',
                          fontSize: '12px',
                          textTransform: 'capitalize',
                        }}
                      >
                        {project.type}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                
                <TableCell sx={{ borderBottom: '1px solid #333' }}>
                  <Typography
                    sx={{
                      color: '#ccc',
                      fontSize: '13px',
                    }}
                  >
                    {project.lastUpdated}
                  </Typography>
                </TableCell>
                
                <TableCell sx={{ borderBottom: '1px solid #333' }}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {project.collaborators.slice(0, 3).map((collaborator, index) => (
                      <Avatar
                        key={index}
                        sx={{
                          width: 24,
                          height: 24,
                          fontSize: '10px',
                          bgcolor: '#C0FF92',
                          color: '#000',
                        }}
                      >
                        {collaborator.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                    ))}
                    {project.collaborators.length > 3 && (
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          fontSize: '10px',
                          bgcolor: '#666',
                          color: '#fff',
                        }}
                      >
                        +{project.collaborators.length - 3}
                      </Avatar>
                    )}
                  </Box>
                </TableCell>
                
                <TableCell sx={{ borderBottom: '1px solid #333' }}>
                  <Chip
                    label={project.status.replace('-', ' ')}
                    size="small"
                    sx={{
                      ...getStatusColor(project.status),
                      fontWeight: 'bold',
                      fontSize: '11px',
                      textTransform: 'capitalize',
                    }}
                  />
                </TableCell>
                
                <TableCell sx={{ borderBottom: '1px solid #333' }}>
                  <Button
                    startIcon={<VisibilityIcon />}
                    size="small"
                    sx={{
                      color: '#C0FF92',
                      textTransform: 'none',
                      fontSize: '12px',
                      '&:hover': {
                        bgcolor: 'rgba(192, 255, 146, 0.1)',
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
    </Paper>
  )
}

export default ResearchTable 