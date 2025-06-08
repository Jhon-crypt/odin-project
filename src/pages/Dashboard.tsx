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
import DescriptionIcon from '@mui/icons-material/Description'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ProjectHeader from '../components/ProjectHeader'
import ChatArea from '../components/ChatArea'
import ResearchCanvas from '../components/ResearchCanvas'

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
        {/* Mobile FAB Navigation - Improved positioning */}
        {isMobile && (
          <>
            <IconButton
              onClick={() => setLeftDrawerOpen(true)}
              sx={{
                position: 'fixed',
                top: { xs: 12, sm: 16 },
                left: { xs: 12, sm: 16 },
                zIndex: 1400,
                bgcolor: '#1a1a1a',
                color: '#C0FF92',
                border: '1px solid #333',
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(8px)',
                '&:hover': {
                  bgcolor: '#333',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <MenuIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
            </IconButton>
            <IconButton
              onClick={() => setRightDrawerOpen(true)}
              sx={{
                position: 'fixed',
                top: { xs: 12, sm: 16 },
                right: { xs: 12, sm: 16 },
                zIndex: 1400,
                bgcolor: '#1a1a1a',
                color: '#C0FF92',
                border: '1px solid #333',
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(8px)',
                '&:hover': {
                  bgcolor: '#333',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <DescriptionIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
            </IconButton>
          </>
        )}

        {/* Left Sidebar */}
        {isDesktop ? (
          <Box
            sx={{
              width: 280,
              flexShrink: 0,
              height: '100vh',
              overflow: 'hidden',
            }}
          >
            <Sidebar activeProject="AI Research Papers" />
          </Box>
        ) : (
          <Drawer
            anchor="left"
            open={leftDrawerOpen}
            onClose={() => setLeftDrawerOpen(false)}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile
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
            minWidth: 0,
            width: '100%',
            height: '100vh',
            // Add padding top on mobile to account for FABs
            pt: { xs: 0, sm: 0 },
          }}
        >
          {/* Top Header */}
          <Box
            sx={{
              flexShrink: 0,
              width: '100%',
            }}
          >
            <ProjectHeader
              projectTitle="AI Research Papers"
              projectSubtitle="Collaborative analysis of machine learning publications"
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
            <ChatArea />
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
            }}
          >
            <ResearchCanvas />
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
            <ResearchCanvas />
          </Drawer>
        )}
      </Box>
    </ThemeProvider>
  )
}

export default Dashboard 