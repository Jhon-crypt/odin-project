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
        p: { xs: 3, md: 4 },
        mb: 3,
        border: '1px solid #333',
        width: '100%',
        maxWidth: 'none',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 3 }}>
        {/* Avatar */}
        <Avatar
          sx={{
            width: { xs: 80, md: 100 },
            height: { xs: 80, md: 100 },
            bgcolor: '#C0FF92',
            color: '#000',
            fontSize: { xs: '28px', md: '36px' },
            fontWeight: 'bold',
          }}
        >
          JD
        </Avatar>

        {/* Profile Info */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography
              variant="h4"
              sx={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: { xs: '24px', md: '32px' },
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
                fontSize: { xs: '11px', md: '12px' },
              }}
            />
          </Box>

          {/* Profile Details */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3, 
            mt: 2,
            '& > div': {
              minWidth: { xs: '100%', sm: '150px', md: '200px' },
              flex: { xs: '1 0 100%', sm: '1 0 calc(50% - 12px)', md: '1 0 calc(25% - 18px)' }
            }
          }}>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: '#888',
                  fontSize: { xs: '11px', md: '12px' },
                  display: 'block',
                  mb: 0.5,
                }}
              >
                Institution
              </Typography>
              <Typography
                sx={{
                  color: '#fff',
                  fontSize: { xs: '13px', md: '14px' },
                  fontWeight: 'medium',
                }}
              >
                Stanford University
              </Typography>
            </Box>
            
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: '#888',
                  fontSize: { xs: '11px', md: '12px' },
                  display: 'block',
                  mb: 0.5,
                }}
              >
                Researcher ID
              </Typography>
              <Typography
                sx={{
                  color: '#fff',
                  fontSize: { xs: '13px', md: '14px' },
                  fontWeight: 'medium',
                }}
              >
                ODN-R-2024
              </Typography>
            </Box>
            
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: '#888',
                  fontSize: { xs: '11px', md: '12px' },
                  display: 'block',
                  mb: 0.5,
                }}
              >
                Department
              </Typography>
              <Typography
                sx={{
                  color: '#fff',
                  fontSize: { xs: '13px', md: '14px' },
                  fontWeight: 'medium',
                }}
              >
                Computer Science
              </Typography>
            </Box>
            
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: '#888',
                  fontSize: { xs: '11px', md: '12px' },
                  display: 'block',
                  mb: 0.5,
                }}
              >
                Specialization
              </Typography>
              <Typography
                sx={{
                  color: '#fff',
                  fontSize: { xs: '13px', md: '14px' },
                  fontWeight: 'medium',
                }}
              >
                AI & Machine Learning
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flexDirection: { xs: 'column', sm: 'row' },
          minWidth: 'fit-content',
        }}>
          <Button
            startIcon={<EditIcon />}
            variant="outlined"
            sx={{
              borderColor: '#333',
              color: '#ccc',
              textTransform: 'none',
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
            sx={{
              bgcolor: '#C0FF92',
              color: '#000',
              textTransform: 'none',
              fontWeight: 'bold',
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
  )
}

export default ResearchProfileHeader 