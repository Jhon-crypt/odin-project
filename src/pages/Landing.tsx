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
  TextField,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Landing() {
  const [currentView, setCurrentView] = useState('landing') // 'landing', 'login', 'signup'
  const navigate = useNavigate()

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

  // Mock user avatars
  const userAvatars = [
    'https://i.pravatar.cc/150?img=1',
    'https://i.pravatar.cc/150?img=2',
    'https://i.pravatar.cc/150?img=3',
    'https://i.pravatar.cc/150?img=4',
    'https://i.pravatar.cc/150?img=5',
    'https://i.pravatar.cc/150?img=6',
  ]

  const handleLogin = () => {
    navigate('/dashboard')
  }

  const handleSignup = () => {
    navigate('/dashboard')
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {/* Left Panel */}
        <Box
          sx={{
            width: '50%',
            bgcolor: '#111111',
            background: 'radial-gradient(circle at 30% 50%, #1a1a1a 0%, #111111 70%)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              position: 'absolute',
              top: { xs: 20, sm: 24, md: 32 },
              left: { xs: 20, sm: 24, md: 32 },
              zIndex: 10,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '28px', sm: '30px', md: '32px' },
                fontWeight: 'bold',
                color: '#ffffff',
              }}
            >
              🔬
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
              gap: { xs: 2, sm: 2.5, md: 3 },
              maxWidth: { xs: '90%', sm: '80%', md: '100%' },
              flex: 1,
              px: { xs: 3, sm: 4, md: 6 },
            }}
          >
            {currentView === 'landing' && (
              <>
                {/* Workspace Avatar */}
                <Avatar
                  sx={{
                    width: { xs: 56, sm: 64, md: 72 },
                    height: { xs: 56, sm: 64, md: 72 },
                    bgcolor: '#333',
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    fontWeight: 'bold',
                  }}
                >
                  🔬
                </Avatar>

                {/* Title and Subtext */}
                <Box sx={{ mb: { xs: 1.5, sm: 2, md: 2 } }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 'bold',
                      color: '#ffffff',
                      mb: { xs: 0.5, sm: 0.75, md: 1 },
                      fontSize: { xs: '2rem', sm: '2.25rem', md: '2.75rem', lg: '3rem' },
                      lineHeight: { xs: 1.2, md: 1.1 },
                    }}
                  >
                    Odin Project
                  </Typography>
                  <Typography
                    sx={{
                      color: '#C0FF92',
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      fontWeight: 400,
                      mb: { xs: 1, sm: 1.25, md: 1.5 },
                    }}
                  >
                    AI-Powered Research Paper Tool
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: { xs: 1.5, sm: 2, md: 2 },
                  flexDirection: { xs: 'column', sm: 'row' },
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Button
                    variant="contained"
                    onClick={() => setCurrentView('signup')}
                    sx={{
                      bgcolor: '#C0FF92',
                      color: '#000',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                      px: { xs: 3, sm: 3.5, md: 4 },
                      py: { xs: 1.25, sm: 1.375, md: 1.5 },
                      borderRadius: { xs: '10px', md: '12px' },
                      textTransform: 'none',
                      minWidth: { xs: '140px', sm: '130px', md: '140px' },
                      '&:hover': {
                        bgcolor: '#A8E67A',
                      },
                    }}
                  >
                    Get Started
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={() => setCurrentView('login')}
                    sx={{
                      borderColor: '#C0FF92',
                      color: '#C0FF92',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                      px: { xs: 3, sm: 3.5, md: 4 },
                      py: { xs: 1.25, sm: 1.375, md: 1.5 },
                      borderRadius: { xs: '10px', md: '12px' },
                      textTransform: 'none',
                      minWidth: { xs: '140px', sm: '130px', md: '140px' },
                      '&:hover': {
                        borderColor: '#A8E67A',
                        color: '#A8E67A',
                        bgcolor: 'rgba(192, 255, 146, 0.1)',
                      },
                    }}
                  >
                    Login
                  </Button>
                </Box>

                {/* Additional Info */}
                <Typography
                  sx={{
                    color: '#888888',
                    fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                    mb: { xs: 2, sm: 2.5, md: 3 },
                    textAlign: 'center',
                    lineHeight: 1.4,
                  }}
                >
                  Analyze, summarize, and collaborate on research papers with AI
                </Typography>

                {/* Avatar Group */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: { xs: 1.5, sm: 1.75, md: 2 },
                  width: '100%',
                }}>
                  <AvatarGroup
                    max={6}
                    sx={{
                      '& .MuiAvatar-root': {
                        width: { xs: 32, sm: 36, md: 40 },
                        height: { xs: 32, sm: 36, md: 40 },
                        border: { xs: '1.5px solid #333', md: '2px solid #333' },
                        fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
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
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem' },
                      textAlign: 'center',
                      lineHeight: 1.4,
                      px: { xs: 1, sm: 0 },
                    }}
                  >
                    Join 1,200+ researchers and academics already using Odin
                  </Typography>
                </Box>
              </>
            )}

            {currentView === 'login' && (
              <>
                <Avatar
                  sx={{
                    width: { xs: 56, sm: 64, md: 72 },
                    height: { xs: 56, sm: 64, md: 72 },
                    bgcolor: '#333',
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    fontWeight: 'bold',
                    mb: 2,
                  }}
                >
                  🔬
                </Avatar>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 'bold',
                    color: '#ffffff',
                    mb: 3,
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                  }}
                >
                  Welcome Back
                </Typography>

                <Box sx={{ width: '100%', maxWidth: '400px' }}>
                  <TextField
                    fullWidth
                    type="email"
                    placeholder="Email"
                    variant="outlined"
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#1a1a1a',
                        color: '#fff',
                        borderRadius: '12px',
                        '& fieldset': {
                          borderColor: '#333',
                        },
                        '&:hover fieldset': {
                          borderColor: '#555',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#C0FF92',
                        },
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#888',
                        opacity: 1,
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    type="password"
                    placeholder="Password"
                    variant="outlined"
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#1a1a1a',
                        color: '#fff',
                        borderRadius: '12px',
                        '& fieldset': {
                          borderColor: '#333',
                        },
                        '&:hover fieldset': {
                          borderColor: '#555',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#C0FF92',
                        },
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#888',
                        opacity: 1,
                      },
                    }}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            color: '#555',
                            '&.Mui-checked': {
                              color: '#C0FF92',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ color: '#888', fontSize: '0.9rem' }}>
                          Remember me
                        </Typography>
                      }
                    />
                    <Link href="#" sx={{ color: '#C0FF92', textDecoration: 'none', fontSize: '0.9rem' }}>
                      Forgot Password?
                    </Link>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleLogin}
                    sx={{
                      bgcolor: '#C0FF92',
                      color: '#000',
                      fontWeight: 'bold',
                      py: 1.5,
                      borderRadius: '12px',
                      textTransform: 'none',
                      mb: 3,
                      '&:hover': {
                        bgcolor: '#A8E67A',
                      },
                    }}
                  >
                    Log in
                  </Button>

                  <Typography sx={{ color: '#888', textAlign: 'center' }}>
                    Don't have an account?{' '}
                    <Link
                      href="#"
                      onClick={() => setCurrentView('signup')}
                      sx={{ color: '#C0FF92', textDecoration: 'none', cursor: 'pointer' }}
                    >
                      Sign Up
                    </Link>
                  </Typography>

                  <Button
                    onClick={() => setCurrentView('landing')}
                    sx={{
                      color: '#888',
                      textTransform: 'none',
                      mt: 2,
                      '&:hover': {
                        color: '#aaa',
                      },
                    }}
                  >
                    ← Back to Home
                  </Button>
                </Box>
              </>
            )}

            {currentView === 'signup' && (
              <>
                <Avatar
                  sx={{
                    width: { xs: 56, sm: 64, md: 72 },
                    height: { xs: 56, sm: 64, md: 72 },
                    bgcolor: '#333',
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    fontWeight: 'bold',
                    mb: 2,
                  }}
                >
                  🔬
                </Avatar>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 'bold',
                    color: '#ffffff',
                    mb: 3,
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                  }}
                >
                  Join Odin Project
                </Typography>

                <Box sx={{ width: '100%', maxWidth: '400px' }}>
                  <TextField
                    fullWidth
                    placeholder="Username"
                    variant="outlined"
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#1a1a1a',
                        color: '#fff',
                        borderRadius: '12px',
                        '& fieldset': {
                          borderColor: '#333',
                        },
                        '&:hover fieldset': {
                          borderColor: '#555',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#C0FF92',
                        },
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#888',
                        opacity: 1,
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    type="email"
                    placeholder="Email"
                    variant="outlined"
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#1a1a1a',
                        color: '#fff',
                        borderRadius: '12px',
                        '& fieldset': {
                          borderColor: '#333',
                        },
                        '&:hover fieldset': {
                          borderColor: '#555',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#C0FF92',
                        },
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#888',
                        opacity: 1,
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    type="password"
                    placeholder="Password"
                    variant="outlined"
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#1a1a1a',
                        color: '#fff',
                        borderRadius: '12px',
                        '& fieldset': {
                          borderColor: '#333',
                        },
                        '&:hover fieldset': {
                          borderColor: '#555',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#C0FF92',
                        },
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#888',
                        opacity: 1,
                      },
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSignup}
                    sx={{
                      bgcolor: '#C0FF92',
                      color: '#000',
                      fontWeight: 'bold',
                      py: 1.5,
                      borderRadius: '12px',
                      textTransform: 'none',
                      mb: 3,
                      '&:hover': {
                        bgcolor: '#A8E67A',
                      },
                    }}
                  >
                    Create Account
                  </Button>

                  <Typography sx={{ color: '#888', textAlign: 'center' }}>
                    Already have an account?{' '}
                    <Link
                      href="#"
                      onClick={() => setCurrentView('login')}
                      sx={{ color: '#C0FF92', textDecoration: 'none', cursor: 'pointer' }}
                    >
                      Log In
                    </Link>
                  </Typography>

                  <Button
                    onClick={() => setCurrentView('landing')}
                    sx={{
                      color: '#888',
                      textTransform: 'none',
                      mt: 2,
                      '&:hover': {
                        color: '#aaa',
                      },
                    }}
                  >
                    ← Back to Home
                  </Button>
                </Box>
              </>
            )}
          </Box>

          {/* Footer */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', sm: 'space-between' },
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 },
              p: { xs: 2, sm: 3, md: 4 },
              color: '#666666',
              fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
            }}
          >
            <Typography sx={{ fontSize: 'inherit', color: 'inherit' }}>
              Odin Project © 2024
            </Typography>
            <Link
              href="#"
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                fontSize: 'inherit',
                '&:hover': { color: '#888888' },
              }}
            >
              Privacy Policy
            </Link>
          </Box>
        </Box>

        {/* Right Panel - 3D Image */}
        <Box
          sx={{
            width: '50%',
            position: 'relative',
            display: { xs: 'none', md: 'block' },
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src="/Illustration.png"
            alt="3D Illustration"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default Landing 