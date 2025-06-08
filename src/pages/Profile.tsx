import {
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material'
import ResearchProfileHeader from '../components/ResearchProfileHeader'
import ResearchHistoryCard from '../components/ResearchHistoryCard'
import ResearchTable from '../components/ResearchTable'

function Profile() {

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#C0FF92',
      },
      background: {
        default: '#111111',
        paper: '#1a1a1a',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#111111',
          pb: { xs: 2, sm: 3, md: 4 },
          width: '100vw',
          maxWidth: 'none',
          margin: 0,
          padding: 0,
          overflow: 'auto',
        }}
      >
        <Box sx={{ 
          px: { xs: 1, sm: 2, md: 3, lg: 4 }, 
          pt: { xs: 1, sm: 2, md: 3 }, 
          width: '100%', 
          maxWidth: 'none',
          margin: '0 auto'
        }}>
          {/* Profile Header */}
          <ResearchProfileHeader />

          {/* Main Content */}
          <Box sx={{ 
            mt: { xs: 1, sm: 2 },
            maxWidth: { xs: '100%', lg: '1400px' },
            margin: '0 auto'
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: { xs: 1.5, sm: 2, md: 3 } 
            }}>
              {/* Research History */}
              <ResearchHistoryCard />
              
              {/* Research Projects Table */}
              <ResearchTable />
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default Profile 