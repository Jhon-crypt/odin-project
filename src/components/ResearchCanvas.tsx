import {
  Box,
  Typography,
  Chip,
  Stack,
  Paper,
} from '@mui/material'
import DescriptionIcon from '@mui/icons-material/Description'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PsychologyIcon from '@mui/icons-material/Psychology'

interface ResearchSection {
  id: string
  title: string
  content: string
  type: 'finding' | 'insight' | 'conclusion' | 'methodology'
  timestamp: string
}

function ResearchCanvas() {
  const researchSections: ResearchSection[] = [
    {
      id: '1',
      title: 'Leadership Structures',
      content: 'Clear command hierarchies are essential for Mars missions. Research indicates that successful long-duration missions require both formal authority structures and informal leadership emergence mechanisms.',
      type: 'finding',
      timestamp: '2 minutes ago',
    },
    {
      id: '2',
      title: 'Psychological Dynamics',
      content: 'Crew psychology in isolated environments shows predictable patterns: initial excitement, reality adjustment, potential conflict periods, and stabilization phases.',
      type: 'insight',
      timestamp: '2 minutes ago',
    },
    {
      id: '3',
      title: 'Conflict Resolution Protocols',
      content: 'Implementation of structured communication protocols and private retreat spaces significantly reduces interpersonal tensions in confined environments.',
      type: 'methodology',
      timestamp: '2 minutes ago',
    },
    {
      id: '4',
      title: 'Team Cohesion Maintenance',
      content: 'Regular group activities, shared goals, and rotation of responsibilities help maintain social bonds during extended isolation periods.',
      type: 'conclusion',
      timestamp: '2 minutes ago',
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'finding':
        return <DescriptionIcon sx={{ fontSize: 16 }} />
      case 'insight':
        return <LightbulbIcon sx={{ fontSize: 16 }} />
      case 'methodology':
        return <TrendingUpIcon sx={{ fontSize: 16 }} />
      case 'conclusion':
        return <PsychologyIcon sx={{ fontSize: 16 }} />
      default:
        return <DescriptionIcon sx={{ fontSize: 16 }} />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'finding':
        return '#C0FF92'
      case 'insight':
        return '#FFB347'
      case 'methodology':
        return '#87CEEB'
      case 'conclusion':
        return '#DDA0DD'
      default:
        return '#C0FF92'
    }
  }

  return (
    <Box
      sx={{
        width: { xs: '100vw', sm: 320, lg: 280 },
        height: '100vh',
        bgcolor: '#1a1a1a',
        borderLeft: '1px solid #333',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: { xs: 'fixed', lg: 'static' },
        top: 0,
        right: 0,
        zIndex: { xs: 1000, lg: 'auto' },
      }}
    >
      {/* Header */}
      <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: '1px solid #333' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <DescriptionIcon sx={{ color: '#C0FF92', fontSize: 20 }} />
          <Typography
            variant="h6"
            sx={{
              color: '#C0FF92',
              fontWeight: 'bold',
              fontSize: { xs: '16px', md: '18px' },
            }}
          >
            Research Canvas
          </Typography>
        </Box>
        <Typography
          sx={{
            color: '#888',
            fontSize: { xs: '12px', md: '13px' },
          }}
        >
          Live document from conversation
        </Typography>
      </Box>

      {/* Document Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 3 } }}>
        {/* Document Title */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: '#0f0f0f',
            border: '1px solid #333',
            borderRadius: 2,
            p: { xs: 2, md: 3 },
            mb: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: { xs: '14px', md: '16px' },
              mb: 1,
            }}
          >
            Spaceship Crew Psychology Analysis
          </Typography>
          <Typography
            sx={{
              color: '#888',
              fontSize: { xs: '11px', md: '12px' },
              lineHeight: 1.4,
            }}
          >
            Comprehensive analysis of psychological dynamics, leadership structures, 
            and team cohesion strategies for long-duration Mars missions.
          </Typography>
        </Paper>

        {/* Research Sections */}
        <Stack spacing={{ xs: 2, md: 2.5 }}>
          {researchSections.map((section, index) => (
            <Paper
              key={section.id}
              elevation={0}
              sx={{
                bgcolor: '#111111',
                border: '1px solid #333',
                borderRadius: 2,
                p: { xs: 2, md: 2.5 },
                position: 'relative',
                '&:hover': {
                  borderColor: '#444',
                  bgcolor: '#151515',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {/* Section Number */}
              <Typography
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: '#666',
                  fontSize: { xs: '10px', md: '11px' },
                  fontWeight: 'bold',
                }}
              >
                {index + 1}
              </Typography>

              {/* Section Type Chip */}
              <Chip
                icon={getTypeIcon(section.type)}
                label={section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                size="small"
                sx={{
                  bgcolor: 'transparent',
                  border: `1px solid ${getTypeColor(section.type)}`,
                  color: getTypeColor(section.type),
                  fontSize: { xs: '10px', md: '11px' },
                  height: { xs: 20, md: 24 },
                  mb: 1.5,
                  '& .MuiChip-icon': {
                    color: getTypeColor(section.type),
                  },
                }}
              />

              {/* Section Title */}
              <Typography
                variant="subtitle1"
                sx={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: { xs: '13px', md: '14px' },
                  mb: 1,
                  lineHeight: 1.3,
                }}
              >
                {section.title}
              </Typography>

              {/* Section Content */}
              <Typography
                sx={{
                  color: '#ccc',
                  fontSize: { xs: '11px', md: '12px' },
                  lineHeight: 1.5,
                  mb: 1,
                }}
              >
                {section.content}
              </Typography>

              {/* Timestamp */}
              <Typography
                sx={{
                  color: '#666',
                  fontSize: { xs: '10px', md: '11px' },
                  fontStyle: 'italic',
                }}
              >
                Added {section.timestamp}
              </Typography>
            </Paper>
          ))}
        </Stack>

        {/* Summary Section */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: '#0a0a0a',
            border: '2px solid #C0FF92',
            borderRadius: 2,
            p: { xs: 2, md: 3 },
            mt: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#C0FF92',
              fontWeight: 'bold',
              fontSize: { xs: '13px', md: '14px' },
              mb: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <PsychologyIcon sx={{ fontSize: { xs: 16, md: 18 } }} />
            Key Insights
          </Typography>
          <Typography
            sx={{
              color: '#ccc',
              fontSize: { xs: '11px', md: '12px' },
              lineHeight: 1.5,
            }}
          >
            Successful Mars mission crews require balanced leadership, structured conflict resolution, 
            regular psychological support, and deliberate team cohesion activities to maintain 
            effectiveness during extended isolation.
          </Typography>
        </Paper>
      </Box>
    </Box>
  )
}

export default ResearchCanvas 