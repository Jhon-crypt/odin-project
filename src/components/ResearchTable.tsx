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
} from '@mui/material'

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
        p: { xs: 2, sm: 3 }, 
        borderBottom: '1px solid #333' 
      }}>
        <Typography
          variant="h6"
          sx={{
            color: '#fff',
            fontWeight: 'bold',
            fontSize: { xs: '16px', sm: '18px' },
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
              <TableCell sx={{ 
                color: '#888', 
                borderBottom: '1px solid #333', 
                fontSize: { xs: '11px', sm: '12px' },
                display: { xs: 'table-cell' }
              }}>
                Project
              </TableCell>
              <TableCell sx={{ 
                color: '#888', 
                borderBottom: '1px solid #333', 
                fontSize: { xs: '11px', sm: '12px' },
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
                }}
              >
                <TableCell sx={{ borderBottom: '1px solid #333' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: { xs: '18px', sm: '20px' } }}>
                      {getTypeIcon(project.type)}
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          color: '#fff',
                          fontSize: { xs: '13px', sm: '14px' },
                          fontWeight: 'medium',
                          lineHeight: 1.3,
                        }}
                      >
                        {project.title}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: { xs: 0.5, sm: 2 }
                      }}>
                        <Typography
                          sx={{
                            color: '#888',
                            fontSize: { xs: '11px', sm: '12px' },
                            textTransform: 'capitalize',
                          }}
                        >
                          {project.type}
                        </Typography>
                        <Typography
                          sx={{
                            color: '#ccc',
                            fontSize: { xs: '11px', sm: '13px' },
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
                  display: { xs: 'none', sm: 'table-cell' }
                }}>
                  <Typography
                    sx={{
                      color: '#ccc',
                      fontSize: '13px',
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