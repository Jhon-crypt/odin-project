import {
  Box,
  Typography,
  Paper,
  Chip,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WorkIcon from '@mui/icons-material/Work'

function StatusCards() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Research Status Card */}
      <Paper
        sx={{
          bgcolor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: 2,
          p: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <CheckCircleIcon sx={{ color: '#C0FF92', fontSize: 24 }} />
          <Typography
            variant="h6"
            sx={{
              color: '#C0FF92',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            Active Researcher
          </Typography>
        </Box>
        
        <Box sx={{ mb: 1 }}>
          <Typography
            sx={{
              color: '#888',
              fontSize: '12px',
              mb: 0.5,
            }}
          >
            Last Activity
          </Typography>
          <Typography
            sx={{
              color: '#fff',
              fontSize: '14px',
              fontWeight: 'medium',
            }}
          >
            Dec 15, 2024
          </Typography>
        </Box>
        
        <Box>
          <Typography
            sx={{
              color: '#888',
              fontSize: '12px',
              mb: 0.5,
            }}
          >
            Papers Published
          </Typography>
          <Typography
            sx={{
              color: '#C0FF92',
              fontSize: '18px',
              fontWeight: 'bold',
            }}
          >
            42 this year
          </Typography>
        </Box>
      </Paper>

      {/* Current Project Card */}
      <Paper
        sx={{
          bgcolor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: 2,
          p: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <WorkIcon sx={{ color: '#FFB347', fontSize: 24 }} />
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            Current Project
          </Typography>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              color: '#888',
              fontSize: '12px',
              mb: 0.5,
            }}
          >
            Project Title
          </Typography>
          <Typography
            sx={{
              color: '#fff',
              fontSize: '14px',
              fontWeight: 'medium',
              lineHeight: 1.4,
            }}
          >
            AI Research Papers Analysis
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              sx={{
                color: '#888',
                fontSize: '12px',
                mb: 0.5,
              }}
            >
              Started
            </Typography>
            <Typography
              sx={{
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'medium',
              }}
            >
              Nov 1, 2024
            </Typography>
          </Box>
          
          <Chip
            label="In Progress"
            size="small"
            sx={{
              bgcolor: '#C0FF92',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '11px',
            }}
          />
        </Box>
      </Paper>
    </Box>
  )
}

export default StatusCards 