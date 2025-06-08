import {
  Box,
  Typography,
  Paper,
  Divider,
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SchoolIcon from '@mui/icons-material/School'

function LocationCard() {
  return (
    <Paper
      sx={{
        bgcolor: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: 2,
        p: 3,
        width: '100%',
        maxWidth: 'none',
      }}
    >
      {/* Institution Info */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <SchoolIcon sx={{ color: '#C0FF92', fontSize: 24 }} />
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            Institution
          </Typography>
        </Box>
        
        <Typography
          sx={{
            color: '#C0FF92',
            fontSize: '18px',
            fontWeight: 'bold',
            mb: 1,
          }}
        >
          Stanford University
        </Typography>
        
        <Typography
          sx={{
            color: '#888',
            fontSize: '14px',
            lineHeight: 1.4,
          }}
        >
          Computer Science Department
        </Typography>
      </Box>

      <Divider sx={{ borderColor: '#333', my: 2 }} />

      {/* Location Details */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <LocationOnIcon sx={{ color: '#C0FF92', fontSize: 24 }} />
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            Location
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
            Address
          </Typography>
          <Typography
            sx={{
              color: '#fff',
              fontSize: '14px',
              fontWeight: 'medium',
              lineHeight: 1.4,
            }}
          >
            353 Jane Stanford Way,<br />
            Stanford, CA 94305
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              sx={{
                color: '#888',
                fontSize: '12px',
                mb: 0.5,
              }}
            >
              Building
            </Typography>
            <Typography
              sx={{
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'medium',
              }}
            >
              Gates Computer Science
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
              Office
            </Typography>
            <Typography
              sx={{
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'medium',
              }}
            >
              Room 314
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Map Placeholder */}
      <Box
        sx={{
          mt: 3,
          height: 150,
          bgcolor: '#0f0f0f',
          border: '1px solid #333',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            color: '#666',
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          🗺️<br />
          Stanford University<br />
          Campus Map
        </Typography>
      </Box>
    </Paper>
  )
}

export default LocationCard 