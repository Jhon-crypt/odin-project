import {
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material'
import { useState } from 'react'
import ResearchProfileHeader from '../components/ResearchProfileHeader'
import NavigationTabs from '../components/NavigationTabs'
import ResearchHistoryCard from '../components/ResearchHistoryCard'
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
          width: '100vw',
          maxWidth: 'none',
          margin: 0,
          padding: 0,
          overflow: 'auto',
        }}
      >
        <Box sx={{ px: 3, pt: 3, width: '100%', maxWidth: 'none' }}>
          {/* Profile Header */}
          <ResearchProfileHeader />

          {/* Navigation Tabs */}
          <NavigationTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {/* Main Content */}
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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