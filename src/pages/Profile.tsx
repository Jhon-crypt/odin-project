import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Badge,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material'
import { useState } from 'react'
import ResearchProfileHeader from '../components/ResearchProfileHeader'
import NavigationTabs from '../components/NavigationTabs'
import ResearchHistoryCard from '../components/ResearchHistoryCard'
import StatusCards from '../components/StatusCards'
import LocationCard from '../components/LocationCard'
import ResearchTable from '../components/ResearchTable'

function Profile() {
  const [activeTab, setActiveTab] = useState(0)

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
  })

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#111111',
          pb: 4,
        }}
      >
        <Container maxWidth="xl" sx={{ pt: 3 }}>
          {/* Profile Header */}
          <ResearchProfileHeader />

          {/* Navigation Tabs */}
          <NavigationTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {/* Main Content */}
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Left Column - Main Content */}
            <Grid item xs={12} lg={8}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Research History */}
                <ResearchHistoryCard />
                
                {/* Research Projects Table */}
                <ResearchTable />
              </Box>
            </Grid>

            {/* Right Sidebar */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Status Cards */}
                <StatusCards />
                
                {/* Location/Institution Card */}
                <LocationCard />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default Profile 