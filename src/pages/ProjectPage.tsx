import {
  Box,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Drawer,
  CssBaseline,
} from '@mui/material'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProjectHeader from '../components/ProjectHeader'
import ChatArea from '../components/ChatArea'
import ResearchCanvas from '../components/ResearchCanvas'
import useProjectStore from '../store/projectStore'

function ProjectPage() {
  const { id } = useParams()
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false)
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width:767px)')
  const isLargeDesktop = useMediaQuery('(min-width:1200px)')
  const { projects, fetchProjects } = useProjectStore()
  
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const currentProject = projects.find(p => p.id === id)

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
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          bgcolor: '#111111',
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minWidth: 0,
            width: '100%',
            height: '100vh',
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
              projectTitle={currentProject?.name || 'Untitled'}
              projectSubtitle="Start your research project"
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

export default ProjectPage 