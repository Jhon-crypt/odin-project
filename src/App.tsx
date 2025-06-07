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
        fontSize: '4.5rem',
        fontWeight: 700,
        letterSpacing: '-0.03em',
        lineHeight: 1.1,
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
          background: 'radial-gradient(ellipse at top left, #1a1a2e 0%, #0f172a 50%, #020617 100%)',
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
            py: { xs: 4, md: 0 },
          }}
        >
          {/* Left Side Content */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              pl: { xs: 5, md: 8, lg: 12 },
              pr: { xs: 3, md: 6, lg: 8 },
              width: '50%',
              height: '100%',
            }}
          >
            {/* Logo and Title */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ mb: 4 }}>
                <GeometricLogo size={56} />
              </Box>
              
              <Typography 
                variant="h1" 
                sx={{ 
                  mb: 2,
                  background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: '"Inter", "Roboto", sans-serif',
                }}
              >
                Vertexia
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#94a3b8',
                  mb: 5,
                  fontSize: '1.15rem',
                  fontWeight: 400,
                }}
              >
                vertexia.artifcium.app
              </Typography>
            </Box>

            {/* Change workspace link */}
            <Box sx={{ mb: 4 }}>
              <Link 
                href="#" 
                sx={{ 
                  color: '#64748b',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
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
            <Box sx={{ mb: 5 }}>
              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  px: 5,
                  py: 2,
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <AvatarGroup 
                max={6}
                sx={{
                  '& .MuiAvatar-root': {
                    width: 36,
                    height: 36,
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
                  fontSize: '0.95rem',
                  fontWeight: 500,
                }}
              >
                and 873 others have already joined
              </Typography>
            </Box>
          </Box>

          {/* Right Side - 3D Illustration */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              height: '100vh',
              minHeight: '600px',
              width: '50%',
              pr: { xs: 3, md: 4, lg: 6 },
            }}
          >
            <Box
              component="img"
              src="/Illustration.png"
              alt="3D Illustration"
              sx={{
                width: '100%',
                maxWidth: '95%',
                height: 'auto',
                maxHeight: '90vh',
                objectFit: 'contain',
                filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.4))',
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

        <Box
          sx={{
            position: 'absolute',
            bottom: 32,
            right: 32,
            zIndex: 10,
          }}
        >
          <Link 
            href="#" 
            sx={{ 
              color: '#475569',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              '&:hover': {
                color: '#64748b',
              }
            }}
          >
            Privacy Policy
          </Link>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
