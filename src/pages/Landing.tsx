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
  useMediaQuery,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AutoAwesome as AiIcon } from '@mui/icons-material'

function Landing() {
  const [currentView, setCurrentView] = useState('landing') // 'landing', 'login', 'signup'
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width:767px)')
  const [showSignup, setShowSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      // TODO: Integrate with your Supabase backend
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      setSubmitMessage({ type: 'success', text: 'Thank you! We\'ll notify you when your invitation is ready.' })
      setEmail('')
    } catch {
      setSubmitMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          width: '100vw',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          overflow: 'auto',
        }}
      >
        {/* Main Panel */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            minHeight: { xs: '100vh', md: '100vh' },
            bgcolor: '#111111',
            background: {
              xs: 'linear-gradient(135deg, #1a1a1a 0%, #111111 100%)',
              md: 'radial-gradient(circle at 30% 50%, #1a1a1a 0%, #111111 70%)',
            },
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
              top: { xs: 16, sm: 20, md: 24, lg: 32 },
              left: { xs: 16, sm: 20, md: 24, lg: 32 },
              zIndex: 10,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '24px', sm: '28px', md: '30px', lg: '32px' },
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
              flex: 1,
              px: { xs: 2, sm: 3, md: 4, lg: 6 },
              py: { xs: 4, sm: 3, md: 4 },
              maxWidth: '100%',
            }}
          >
            {currentView === 'landing' && (
              <>
                {/* Workspace Avatar */}
                <Avatar
                  sx={{
                    width: { xs: 48, sm: 56, md: 64, lg: 72 },
                    height: { xs: 48, sm: 56, md: 64, lg: 72 },
                    bgcolor: '#333',
                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' },
                    fontWeight: 'bold',
                  }}
                >
                  🔬
                </Avatar>

                {/* Title and Subtext */}
                <Box sx={{ mb: { xs: 1, sm: 1.5, md: 2 } }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 'bold',
                      color: '#ffffff',
                      mb: { xs: 0.5, sm: 0.75, md: 1 },
                      fontSize: { 
                        xs: '1.5rem', 
                        sm: '1.75rem', 
                        md: '2.25rem', 
                        lg: '2.75rem', 
                        xl: '3rem' 
                      },
                      lineHeight: { xs: 1.3, sm: 1.2, md: 1.1 },
                    }}
                  >
                    Odin Project
                  </Typography>
                  <Typography
                    sx={{
                      color: '#C0FF92',
                      fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' },
                      fontWeight: 400,
                      mb: { xs: 1, sm: 1.25, md: 1.5 },
                    }}
                  >
                    AI-Powered Research Paper Tool
                  </Typography>
                </Box>

                {/* Action Buttons or Signup Form */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 1.5, sm: 2 },
                    width: '100%',
                    maxWidth: '400px',
                    alignItems: 'stretch',
                  }}
                >
                  {!showSignup ? (
                    <>
                      <Button
                        variant="contained"
                        onClick={() => setShowSignup(true)}
                        sx={{
                          bgcolor: '#C0FF92',
                          color: '#111111',
                          py: { xs: 1.5, sm: 1.75 },
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          '&:hover': {
                            bgcolor: '#a8ff66',
                          },
                        }}
                      >
                        Get Started
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setCurrentView('login')}
                        sx={{
                          borderColor: '#333',
                          color: '#ffffff',
                          py: { xs: 1.5, sm: 1.75 },
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          '&:hover': {
                            borderColor: '#555',
                          },
                        }}
                      >
                        Login
                      </Button>
                    </>
                  ) : (
                    <Box
                      component="form"
                      onSubmit={handleEmailSubmit}
                      sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#C0FF92',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          justifyContent: 'center',
                        }}
                      >
                        <AiIcon /> Request Early Access
                      </Typography>
                      <TextField
                        fullWidth
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'rgba(255,255,255,0.05)',
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
                          '& input': {
                            color: '#fff',
                          },
                        }}
                      />
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={isSubmitting}
                          sx={{
                            flex: 1,
                            bgcolor: '#C0FF92',
                            color: '#111111',
                            '&:hover': {
                              bgcolor: '#a8ff66',
                            },
                          }}
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                        <Button
                          onClick={() => {
                            setShowSignup(false)
                            setSubmitMessage(null)
                          }}
                          variant="outlined"
                          sx={{
                            flex: 1,
                            borderColor: '#333',
                            color: '#ffffff',
                            '&:hover': {
                              borderColor: '#555',
                            },
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                      {submitMessage && (
                        <Typography
                          sx={{
                            color: submitMessage.type === 'success' ? '#C0FF92' : '#ff6b6b',
                            fontSize: '0.9rem',
                            textAlign: 'center',
                          }}
                        >
                          {submitMessage.text}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>

                {/* Additional Info */}
                <Typography
                  sx={{
                    color: '#888888',
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem', lg: '0.9rem' },
                    mb: { xs: 2, sm: 2.5, md: 3 },
                    textAlign: 'center',
                    lineHeight: 1.4,
                    maxWidth: { xs: '100%', sm: '320px' },
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
                    max={isMobile ? 4 : 6}
                    sx={{
                      '& .MuiAvatar-root': {
                        width: { xs: 28, sm: 32, md: 36, lg: 40 },
                        height: { xs: 28, sm: 32, md: 36, lg: 40 },
                        border: { xs: '1.5px solid #333', md: '2px solid #333' },
                        fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.75rem', lg: '0.8rem' },
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
                      fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.9rem' },
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
                    width: { xs: 48, sm: 56, md: 64, lg: 72 },
                    height: { xs: 48, sm: 56, md: 64, lg: 72 },
                    bgcolor: '#333',
                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' },
                    fontWeight: 'bold',
                    mb: { xs: 1.5, sm: 2 },
                  }}
                >
                  🔬
                </Avatar>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 'bold',
                    color: '#ffffff',
                    mb: { xs: 2, sm: 2.5, md: 3 },
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' },
                  }}
                >
                  Welcome Back
                </Typography>

                <Box sx={{ 
                  width: '100%', 
                  maxWidth: { xs: '100%', sm: '380px', md: '400px' },
                  px: { xs: 0, sm: 1 },
                }}>
                  <TextField
                    fullWidth
                    type="email"
                    placeholder="Email"
                    variant="outlined"
                    sx={{
                      mb: { xs: 1.5, sm: 2 },
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#1a1a1a',
                        color: '#fff',
                        borderRadius: { xs: '8px', sm: '10px', md: '12px' },
                        fontSize: { xs: '14px', sm: '15px', md: '16px' },
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
                      '& .MuiInputBase-input': {
                        py: { xs: 1.25, sm: 1.5 },
                        fontSize: { xs: '14px', sm: '15px', md: '16px' },
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
                      mb: { xs: 1.5, sm: 2 },
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#1a1a1a',
                        color: '#fff',
                        borderRadius: { xs: '8px', sm: '10px', md: '12px' },
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
                      '& .MuiInputBase-input': {
                        py: { xs: 1.25, sm: 1.5 },
                        fontSize: { xs: '14px', sm: '15px', md: '16px' },
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#888',
                        opacity: 1,
                      },
                    }}
                  />

                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: { xs: 2.5, sm: 3 },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 1.5, sm: 0 },
                  }}>
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
                        <Typography sx={{ 
                          color: '#888', 
                          fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                        }}>
                          Remember me
                        </Typography>
                      }
                    />
                    <Link 
                      href="#" 
                      sx={{ 
                        color: '#C0FF92', 
                        textDecoration: 'none', 
                        fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
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
                      py: { xs: 1.5, sm: 1.5 },
                      borderRadius: { xs: '8px', sm: '10px', md: '12px' },
                      textTransform: 'none',
                      mb: { xs: 2.5, sm: 3 },
                      fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                      minHeight: '48px',
                      '&:hover': {
                        bgcolor: '#A8E67A',
                      },
                    }}
                  >
                    Log in
                  </Button>

                  <Typography sx={{ 
                    color: '#888', 
                    textAlign: 'center',
                    fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                    mb: { xs: 2, sm: 2 },
                  }}>
                    Don't have an account?{' '}
                    <Link
                      href="#"
                      onClick={() => setCurrentView('signup')}
                      sx={{ 
                        color: '#C0FF92', 
                        textDecoration: 'none', 
                        cursor: 'pointer',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Sign Up
                    </Link>
                  </Typography>

                  <Button
                    onClick={() => setCurrentView('landing')}
                    sx={{
                      color: '#888',
                      textTransform: 'none',
                      fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                      minHeight: '44px',
                      '&:hover': {
                        color: '#aaa',
                        bgcolor: 'rgba(255,255,255,0.05)',
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
                    width: { xs: 48, sm: 56, md: 64, lg: 72 },
                    height: { xs: 48, sm: 56, md: 64, lg: 72 },
                    bgcolor: '#333',
                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' },
                    fontWeight: 'bold',
                    mb: { xs: 1.5, sm: 2 },
                  }}
                >
                  🔬
                </Avatar>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 'bold',
                    color: '#ffffff',
                    mb: { xs: 2, sm: 2.5, md: 3 },
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' },
                  }}
                >
                  Join Odin Project
                </Typography>

                <Box sx={{ 
                  width: '100%', 
                  maxWidth: { xs: '100%', sm: '380px', md: '400px' },
                  px: { xs: 0, sm: 1 },
                }}>
                  <TextField
                    fullWidth
                    placeholder="Username"
                    variant="outlined"
                    sx={{
                      mb: { xs: 1.5, sm: 2 },
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#1a1a1a',
                        color: '#fff',
                        borderRadius: { xs: '8px', sm: '10px', md: '12px' },
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
                      '& .MuiInputBase-input': {
                        py: { xs: 1.25, sm: 1.5 },
                        fontSize: { xs: '14px', sm: '15px', md: '16px' },
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
                      mb: { xs: 1.5, sm: 2 },
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#1a1a1a',
                        color: '#fff',
                        borderRadius: { xs: '8px', sm: '10px', md: '12px' },
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
                      '& .MuiInputBase-input': {
                        py: { xs: 1.25, sm: 1.5 },
                        fontSize: { xs: '14px', sm: '15px', md: '16px' },
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
                      mb: { xs: 2.5, sm: 3 },
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#1a1a1a',
                        color: '#fff',
                        borderRadius: { xs: '8px', sm: '10px', md: '12px' },
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
                      '& .MuiInputBase-input': {
                        py: { xs: 1.25, sm: 1.5 },
                        fontSize: { xs: '14px', sm: '15px', md: '16px' },
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
                      py: { xs: 1.5, sm: 1.5 },
                      borderRadius: { xs: '8px', sm: '10px', md: '12px' },
                      textTransform: 'none',
                      mb: { xs: 2.5, sm: 3 },
                      fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                      minHeight: '48px',
                      '&:hover': {
                        bgcolor: '#A8E67A',
                      },
                    }}
                  >
                    Create Account
                  </Button>

                  <Typography sx={{ 
                    color: '#888', 
                    textAlign: 'center',
                    fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                    mb: { xs: 2, sm: 2 },
                  }}>
                    Already have an account?{' '}
                    <Link
                      href="#"
                      onClick={() => setCurrentView('login')}
                      sx={{ 
                        color: '#C0FF92', 
                        textDecoration: 'none', 
                        cursor: 'pointer',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Log In
                    </Link>
                  </Typography>

                  <Button
                    onClick={() => setCurrentView('landing')}
                    sx={{
                      color: '#888',
                      textTransform: 'none',
                      fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                      minHeight: '44px',
                      '&:hover': {
                        color: '#aaa',
                        bgcolor: 'rgba(255,255,255,0.05)',
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
              fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem', lg: '0.8rem' },
              flexShrink: 0,
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
                '&:hover': { 
                  color: '#888888',
                  textDecoration: 'underline',
                },
              }}
            >
              Privacy Policy
            </Link>
          </Box>
        </Box>

        {/* Right Panel - 3D Image (Hidden on mobile/tablet) */}
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
            src="https://res.cloudinary.com/db7wwc9ex/image/upload/v1749841885/Illustration_morco3.png"
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