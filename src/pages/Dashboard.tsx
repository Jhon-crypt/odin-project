import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  useMediaQuery,
  Drawer,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ProjectHeader from '../components/ProjectHeader'

function EmptyState() {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#888',
        p: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: '#ccc' }}>
        No Project Selected
      </Typography>
      <Typography>
        Select a project from the sidebar or create a new one to get started
      </Typography>
    </Box>
  )
}

function Dashboard() {
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false)
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false)
  
  // Better breakpoint handling
  const isMobile = useMediaQuery('(max-width:767px)')
  const isDesktop = useMediaQuery('(min-width:1024px)')
  const isLargeDesktop = useMediaQuery('(min-width:1200px)')

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
        md: 768,
        lg: 1024,
        xl: 1200,
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          bgcolor: '#111111',
          flexDirection: 'row',
          position: 'relative',
        }}
      >
        {/* Left Sidebar */}
        {isDesktop ? (
          <Box
            sx={{
              width: 280,
              flexShrink: 0,
              height: '100vh',
              overflow: 'hidden',
              borderRight: '1px solid #333',
            }}
          >
            <Sidebar />
          </Box>
        ) : (
          <Drawer
            anchor="left"
            open={leftDrawerOpen}
            onClose={() => setLeftDrawerOpen(false)}
            ModalProps={{
              keepMounted: true,
            }}
            PaperProps={{
              sx: {
                width: isMobile ? '85vw' : '320px',
                maxWidth: '320px',
                bgcolor: '#1a1a1a',
                borderRight: '1px solid #333',
              },
            }}
          >
            <Sidebar />
          </Drawer>
        )}

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minWidth: 0,
            width: '100%',
            height: '100vh',
            borderRight: isLargeDesktop ? '1px solid #333' : 'none',
          }}
        >
          {/* Top Header */}
          <Box
            sx={{
              flexShrink: 0,
              width: '100%',
              borderBottom: '1px solid #333',
            }}
          >
            <ProjectHeader
              projectTitle="Research Project"
              projectSubtitle="Select or create a project to get started"
              onLeftMenuClick={() => setLeftDrawerOpen(true)}
              onRightMenuClick={() => setRightDrawerOpen(true)}
            />
          </Box>

          {/* Chat Area */}
          <Box
            sx={{
              flex: 1,
              overflow: 'hidden',
              width: '100%',
            }}
          >
            <EmptyState />
          </Box>
        </Box>

        {/* Right Sidebar */}
        {isLargeDesktop ? (
          <Box
            sx={{
              width: 400,
              flexShrink: 0,
              height: '100vh',
              overflow: 'hidden',
              borderLeft: '1px solid #333',
            }}
          >
            <EmptyState />
          </Box>
        ) : (
          <Drawer
            anchor="right"
            open={rightDrawerOpen}
            onClose={() => setRightDrawerOpen(false)}
            ModalProps={{
              keepMounted: true,
            }}
            PaperProps={{
              sx: {
                width: isMobile ? '90vw' : '400px',
                maxWidth: isMobile ? '90vw' : '400px',
                bgcolor: '#1a1a1a',
                borderLeft: '1px solid #333',
              },
            }}
          >
            <EmptyState />
          </Drawer>
        )}
      </Box>
    </ThemeProvider>
  )
}

export default Dashboard 