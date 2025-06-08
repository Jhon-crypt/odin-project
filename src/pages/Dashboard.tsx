import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  IconButton,
  useMediaQuery,
  Drawer,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import GroupIcon from '@mui/icons-material/Group'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ProjectHeader from '../components/ProjectHeader'
import ChatArea from '../components/ChatArea'
import UserStatus from '../components/UserStatus'

function Dashboard() {
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false)
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false)
  const isLargeScreen = useMediaQuery('(min-width:1200px)')
  const isMediumScreen = useMediaQuery('(min-width:900px)')
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
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        {/* Mobile Navigation Buttons */}
        {!isMediumScreen && (
          <Box
            sx={{
              position: 'fixed',
              top: 16,
              left: 16,
              zIndex: 1100,
              display: 'flex',
              gap: 1,
            }}
          >
            <IconButton
              onClick={() => setLeftDrawerOpen(true)}
              sx={{
                bgcolor: '#1a1a1a',
                color: '#C0FF92',
                border: '1px solid #333',
                '&:hover': {
                  bgcolor: '#333',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}

        {!isLargeScreen && (
          <Box
            sx={{
              position: 'fixed',
              top: 16,
              right: 16,
              zIndex: 1100,
            }}
          >
            <IconButton
              onClick={() => setRightDrawerOpen(true)}
              sx={{
                bgcolor: '#1a1a1a',
                color: '#C0FF92',
                border: '1px solid #333',
                '&:hover': {
                  bgcolor: '#333',
                },
              }}
            >
              <GroupIcon />
            </IconButton>
          </Box>
        )}

        {/* Left Sidebar - Hidden on mobile, drawer on mobile */}
        {isMediumScreen ? (
          <Box>
            <Sidebar activeProject="AI Research Papers" />
          </Box>
        ) : (
          <Drawer
            anchor="left"
            open={leftDrawerOpen}
            onClose={() => setLeftDrawerOpen(false)}
            PaperProps={{
              sx: {
                bgcolor: '#1a1a1a',
                borderRight: '1px solid #333',
              },
            }}
          >
            <Sidebar activeProject="AI Research Papers" />
          </Drawer>
        )}

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minWidth: 0, // Prevents flex overflow
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

        {/* Right Sidebar - Hidden on mobile and tablet, drawer on tablet */}
        {isLargeScreen ? (
          <Box>
            <UserStatus />
          </Box>
        ) : (
          <Drawer
            anchor="right"
            open={rightDrawerOpen}
            onClose={() => setRightDrawerOpen(false)}
            PaperProps={{
              sx: {
                bgcolor: '#1a1a1a',
                borderLeft: '1px solid #333',
              },
            }}
          >
            <UserStatus />
          </Drawer>
        )}
      </Box>
    </ThemeProvider>
  )
}

export default Dashboard 