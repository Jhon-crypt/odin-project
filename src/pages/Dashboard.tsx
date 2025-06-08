import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
} from '@mui/material'
import Sidebar from '../components/Sidebar'
import ProjectHeader from '../components/ProjectHeader'
import ChatArea from '../components/ChatArea'
import UserStatus from '../components/UserStatus'

function Dashboard() {
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          overflow: 'hidden',
          bgcolor: '#111111',
        }}
      >
        {/* Left Sidebar */}
        <Sidebar activeProject="AI Research Papers" />

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Top Header */}
          <ProjectHeader
            projectTitle="AI Research Papers"
            projectSubtitle="Collaborative analysis of machine learning publications"
          />

          {/* Chat Area */}
          <ChatArea />
        </Box>

        {/* Right Sidebar */}
        <UserStatus />
      </Box>
    </ThemeProvider>
  )
}

export default Dashboard 