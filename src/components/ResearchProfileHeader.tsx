import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import EmailIcon from '@mui/icons-material/Email'

function ResearchProfileHeader() {
  return (
    <Box
      sx={{
        bgcolor: '#1a1a1a',
        borderRadius: 2,
        p: { xs: 2, sm: 3, md: 4 },
        mb: { xs: 2, sm: 3 },
        border: '1px solid #333',
        width: '100%',
        maxWidth: 'none',
      }}
    >
      {/* Profile Section */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        gap: { xs: 2, sm: 3 }, 
        mb: { xs: 3, sm: 4 } 
      }}>
        {/* Avatar */}
        <Avatar
          sx={{
            width: { xs: 60, sm: 80, md: 100 },
            height: { xs: 60, sm: 80, md: 100 },
            bgcolor: '#C0FF92',
            color: '#000',
            fontSize: { xs: '20px', sm: '28px', md: '36px' },
            fontWeight: 'bold',
            flexShrink: 0,
          }}
        >
          JD
        </Avatar>

        {/* Name and Info */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            gap: { xs: 2, sm: 3 }, 
            mb: 2
          }}>
            {/* Name and Badge */}
            <Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 2 }, 
                mb: 1 
              }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: { xs: '20px', sm: '24px', md: '32px' },
                    lineHeight: 1.2,
                  }}
                >
                  John Doe
                </Typography>
                <Chip
                  label="Active Researcher"
                  sx={{
                    bgcolor: '#C0FF92',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: { xs: '10px', sm: '11px', md: '12px' },
                    height: { xs: 24, sm: 32 },
                  }}
                />
              </Box>
              <Typography
                sx={{
                  color: '#888',
                  fontSize: { xs: '12px', sm: '13px', md: '14px' },
                  mb: 1,
                }}
              >
                Stanford University • Computer Science Department
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 1.5, sm: 2 },
              flexDirection: { xs: 'row', sm: 'row' },
              alignSelf: { xs: 'flex-start', sm: 'flex-start' },
            }}>
              <Button
                startIcon={<EditIcon />}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: '#333',
                  color: '#ccc',
                  textTransform: 'none',
                  fontSize: { xs: '12px', sm: '14px' },
                  '&:hover': {
                    borderColor: '#C0FF92',
                    color: '#C0FF92',
                  },
                }}
              >
                Edit
              </Button>
              <Button
                startIcon={<EmailIcon />}
                variant="contained"
                size="small"
                sx={{
                  bgcolor: '#C0FF92',
                  color: '#000',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: { xs: '12px', sm: '14px' },
                  '&:hover': {
                    bgcolor: '#A8E87C',
                  },
                }}
              >
                Contact
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* About Section */}
      <Box>
        <Typography
          variant="h6"
          sx={{
            color: '#fff',
            fontWeight: 'bold',
            fontSize: { xs: '14px', sm: '16px', md: '18px' },
            mb: 2,
          }}
        >
          About
        </Typography>
        <Typography
          sx={{
            color: '#ccc',
            fontSize: { xs: '13px', sm: '14px', md: '15px' },
            lineHeight: 1.6,
            maxWidth: '100%',
          }}
        >
          Researcher specializing in AI & Machine Learning with a focus on advancing scientific research through 
          innovative computational methods. Currently working on projects involving spaceship crew psychology analysis 
          and machine learning applications in space exploration.
        </Typography>
      </Box>
    </Box>
  )
}

export default ResearchProfileHeader 