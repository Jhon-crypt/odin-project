import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  Button,
  Avatar,
  AvatarGroup,
  Link,
} from '@mui/material'

function App() {
  const theme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#111111',
        paper: '#111111',
      },
      primary: {
        main: '#C0FF92',
      },
      text: {
        primary: '#ffffff',
        secondary: '#888888',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  })

  // Mock user avatars data
  const userAvatars = [
    'https://i.pravatar.cc/40?img=1',
    'https://i.pravatar.cc/40?img=2', 
    'https://i.pravatar.cc/40?img=3',
    'https://i.pravatar.cc/40?img=4',
    'https://i.pravatar.cc/40?img=5',
    'https://i.pravatar.cc/40?img=6',
    'https://i.pravatar.cc/40?img=7',
  ]

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Global CSS Reset for full width */}
      <style>{`
        html, body, #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100vw !important;
          max-width: 100vw !important;
          overflow-x: hidden;
        }
      `}</style>
      
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Left Panel */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            height: { xs: '100vh', md: '100vh' },
            bgcolor: '#111111',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            px: { xs: 3, md: 4 },
          }}
        >
          {/* Top-left Logo */}
          <Box
            sx={{
              position: 'absolute',
              top: 24,
              left: 24,
              width: 32,
              height: 32,
              bgcolor: '#C0FF92',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: '#000', fontWeight: 'bold', fontSize: '1.2rem' }}>
              A
            </Typography>
          </Box>

          {/* Center content */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 3,
            }}
          >
            {/* Workspace Avatar */}
            <Avatar
              sx={{
                width: 72,
                height: 72,
                bgcolor: '#333',
                fontSize: '2rem',
                fontWeight: 'bold',
              }}
            >
              V
            </Avatar>

            {/* Title and Subtext */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  color: '#ffffff',
                  mb: 1,
                  fontSize: { xs: '2.5rem', md: '3rem' },
                }}
              >
                Vertexia
              </Typography>
              <Typography
                sx={{
                  color: '#C0FF92',
                  fontSize: '1.1rem',
                  fontWeight: 400,
                }}
              >
                vertexia.artifcium.app
              </Typography>
            </Box>

            {/* Join Now Button */}
            <Button
              variant="contained"
              sx={{
                bgcolor: '#C0FF92',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '1rem',
                px: 4,
                py: 1.5,
                borderRadius: '12px',
                textTransform: 'none',
                mb: 1,
                '&:hover': {
                  bgcolor: '#A8E67A',
                },
              }}
            >
              Join Now
            </Button>

            {/* Change workspace link */}
            <Link
              href="#"
              sx={{
                color: '#888888',
                textDecoration: 'none',
                fontSize: '0.9rem',
                mb: 3,
                '&:hover': {
                  color: '#aaa',
                },
              }}
            >
              Change workspace
            </Link>

            {/* Avatar Group */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <AvatarGroup
                max={7}
                sx={{
                  '& .MuiAvatar-root': {
                    width: 40,
                    height: 40,
                    border: '2px solid #333',
                    fontSize: '0.8rem',
                  },
                }}
              >
                {userAvatars.map((avatar, index) => (
                  <Avatar key={index} src={avatar} />
                ))}
              </AvatarGroup>

              <Typography
                sx={{
                  color: '#888888',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                }}
              >
                and 873 others have already joined
              </Typography>
            </Box>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 24,
              left: 24,
              right: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography sx={{ color: '#666', fontSize: '0.85rem' }}>
              Artifcium.app © 2023
            </Typography>
            <Link
              href="#"
              sx={{
                color: '#666',
                textDecoration: 'underline',
                fontSize: '0.85rem',
                cursor: 'pointer',
                '&:hover': {
                  color: '#888',
                },
              }}
            >
              Privacy Policy
            </Link>
          </Box>
        </Box>

        {/* Right Panel */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            height: { xs: '50vh', md: '100vh' },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src="/Illustration.png"
            alt="3D Object"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
