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
        default: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        paper: '#1a1a2e',
      },
      primary: {
        main: '#7dd3fc',
      },
      text: {
        primary: '#ffffff',
        secondary: '#a1a1aa',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '4.8rem',
        fontWeight: 800,
        letterSpacing: '-0.04em',
        lineHeight: 1.05,
      },
      h6: {
        fontSize: '1.15rem',
        fontWeight: 400,
        opacity: 0.75,
      },
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
  ]

  // Complex geometric logo component
  const GeometricLogo = ({ size = 48 }) => (
    <Box
      sx={{
        width: size,
        height: size,
        position: 'relative',
        transform: 'rotate(-15deg)',
      }}
    >
      {/* Multiple layered geometric shapes */}
      <Box
        sx={{
          position: 'absolute',
          width: '60%',
          height: '60%',
          background: 'linear-gradient(45deg, #06b6d4, #3b82f6)',
          clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 0% 80%)',
          top: '10%',
          left: '10%',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '50%',
          height: '50%',
          background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
          clipPath: 'polygon(20% 0%, 100% 20%, 100% 100%, 0% 100%)',
          top: '25%',
          right: '10%',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '40%',
          height: '40%',
          background: 'linear-gradient(225deg, #10b981, #84cc16)',
          clipPath: 'polygon(0% 0%, 80% 0%, 100% 80%, 20% 100%)',
          bottom: '15%',
          left: '20%',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '35%',
          height: '35%',
          background: 'linear-gradient(315deg, #f59e0b, #ef4444)',
          clipPath: 'polygon(0% 20%, 80% 0%, 100% 80%, 20% 100%)',
          top: '30%',
          left: '30%',
        }}
      />
    </Box>
  )

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
          minHeight: '100vh',
          height: '100vh',
          width: '100vw',
          maxWidth: '100vw',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 30%, #16213e 70%, #0f172a 100%)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          margin: 0,
          padding: 0,
        }}
      >
        {/* Top Left Logo */}
        <Box
          sx={{
            position: 'absolute',
            top: 32,
            left: 32,
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              background: 'linear-gradient(45deg, #06b6d4, #3b82f6)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(6, 182, 212, 0.3)',
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                background: 'linear-gradient(45deg, #ffffff, #e2e8f0)',
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
              }}
            />
          </Box>
        </Box>

        {/* Main Content Container */}
        <Box 
          sx={{ 
            flex: 1, 
            display: 'flex',
            width: '100vw',
            maxWidth: '100vw',
            alignItems: 'center',
            px: 0,
            py: { xs: 6, md: 0 },
            position: 'relative',
          }}
        >
          {/* Left Side Content */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              pl: { xs: 4, md: 6, lg: 8 },
              pr: { xs: 2, md: 4, lg: 6 },
              width: { xs: '100%', md: '45%', lg: '40%' },
              height: '100%',
              zIndex: 2,
              position: 'relative',
            }}
          >
            {/* Logo and Title */}
            <Box sx={{ mb: { xs: 2, md: 3 } }}>
              <Box 
                sx={{ 
                  mb: { xs: 3, md: 4 },
                  width: { xs: 44, md: 56 },
                  height: { xs: 44, md: 56 },
                }}
              >
                <GeometricLogo size={56} />
              </Box>
              
              <Typography 
                variant="h1" 
                sx={{ 
                  mb: { xs: 1, md: 2 },
                  background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: '"Inter", "Roboto", sans-serif',
                  fontWeight: 800,
                  fontSize: { xs: '3rem', sm: '3.5rem', md: '4.8rem' },
                }}
              >
                Vertexia
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#94a3b8',
                  mb: { xs: 3, md: 5 },
                  fontSize: { xs: '1rem', md: '1.15rem' },
                  fontWeight: 400,
                }}
              >
                vertexia.artifcium.app
              </Typography>
            </Box>

            {/* Change workspace link */}
            <Box sx={{ mb: { xs: 3, md: 4 } }}>
              <Link 
                href="#" 
                sx={{ 
                  color: '#64748b',
                  textDecoration: 'none',
                  fontSize: { xs: '0.9rem', md: '0.95rem' },
                  fontWeight: 500,
                  '&:hover': {
                    color: '#94a3b8',
                  }
                }}
              >
                Change workspace
              </Link>
            </Box>

            {/* Join Now Button */}
            <Box sx={{ mb: { xs: 4, md: 5 } }}>
              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  px: { xs: 4, md: 5 },
                  py: { xs: 1.5, md: 2 },
                  borderRadius: '12px',
                  textTransform: 'none',
                  boxShadow: '0 8px 32px rgba(132, 204, 22, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #65a30d 0%, #4d7c0f 100%)',
                    boxShadow: '0 12px 48px rgba(132, 204, 22, 0.5)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Join Now
              </Button>
            </Box>

            {/* User Avatars and Count */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: { xs: 2, md: 2.5 },
              flexDirection: { xs: 'column', sm: 'row' },
            }}>
              <AvatarGroup 
                max={6}
                sx={{
                  '& .MuiAvatar-root': {
                    width: { xs: 32, md: 36 },
                    height: { xs: 32, md: 36 },
                    border: '3px solid #1e293b',
                    fontSize: '0.8rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                {userAvatars.map((avatar, index) => (
                  <Avatar key={index} src={avatar} />
                ))}
              </AvatarGroup>
              
              <Typography 
                sx={{ 
                  color: '#64748b',
                  fontSize: { xs: '0.85rem', md: '0.95rem' },
                  fontWeight: 500,
                  textAlign: { xs: 'left', sm: 'left' },
                }}
              >
                and 873 others have already joined
              </Typography>
            </Box>
          </Box>

          {/* Right Side - 3D Illustration */}
          <Box
            sx={{
              position: { xs: 'absolute', md: 'relative' },
              top: { xs: 0, md: 'auto' },
              right: 0,
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-end' },
              alignItems: 'center',
              height: '100vh',
              width: { xs: '100%', md: '55%', lg: '60%' },
              zIndex: 1,
              pr: { xs: 0, md: 2, lg: 4 },
            }}
          >
            <Box
              component="img"
              src="/Illustration.png"
              alt="3D Illustration"
              sx={{
                width: { xs: '80%', sm: '70%', md: '90%', lg: '100%' },
                maxWidth: '100%',
                height: { xs: '60vh', sm: '70vh', md: '90vh', lg: '95vh' },
                objectFit: 'contain',
                filter: 'drop-shadow(0 30px 60px rgba(0, 0, 0, 0.5))',
                opacity: { xs: 0.3, md: 1 },
              }}
            />
          </Box>
        </Box>

        {/* Bottom Footer */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 32,
            left: 32,
            zIndex: 10,
          }}
        >
          <Typography sx={{ color: '#475569', fontSize: '0.9rem', fontWeight: 500 }}>
            Artifcium.app © 2023
          </Typography>
        </Box>

        
      </Box>
    </ThemeProvider>
  )
}

export default App
