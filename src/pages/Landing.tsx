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
  useMediaQuery,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  AutoAwesome as AiIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material'
import { supabase } from '../lib/supabaseClient'

interface AuthError {
  message: string;
  status?: number;
}

function Landing() {
  const [currentView, setCurrentView] = useState('landing') // 'landing', 'login', 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width:767px)')

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      // After successful login, create or update user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            display_name: data.user.email?.split('@')[0] || 'User',
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id'
          })

        if (profileError) {
          console.error('Error updating user profile:', profileError)
        }
      }

      navigate('/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      const error = err as AuthError
      setError(error.message || 'Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !confirmPassword || !displayName) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            display_name: displayName,
          },
        },
      })

      if (signUpError) {
        // Handle specific error cases
        if (signUpError.message.toLowerCase().includes('user already registered')) {
          setError('This email is already registered. Please try logging in instead.')
          return
        }
        throw signUpError
      }

      // After successful signup, create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            display_name: displayName,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id',
            ignoreDuplicates: false
          })

        if (profileError) {
          console.error('Error creating user profile:', profileError)
          setError('An unexpected error occurred during signup. Please try again.')
          return
        }

        // Check if email confirmation is required
        if (!data.session) {
          setSubmitted(true)
          // Log the confirmation URL if in development
          if (process.env.NODE_ENV === 'development') {
            console.info('Development mode - check email confirmation link:', data.user.confirmation_sent_at)
          }
        } else {
          // If no email confirmation required, redirect to dashboard
      navigate('/dashboard')
        }
      }
    } catch (err) {
      console.error('Signup error:', err)
      const error = err as AuthError
      
      // Handle common error messages with user-friendly text
      if (error.message.toLowerCase().includes('duplicate key')) {
        setError('An unexpected error occurred. Please try again.')
      } else if (error.message.toLowerCase().includes('weak password')) {
        setError('Please choose a stronger password. It should be at least 6 characters long.')
      } else if (error.message.toLowerCase().includes('invalid email')) {
        setError('Please enter a valid email address.')
      } else {
        setError(error.message || 'Failed to create account. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setCurrentView('landing')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setDisplayName('')
    setError(null)
    setSubmitted(false)
    setIsLoading(false)
  }

  const handleInviteRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('invited_users')
        .insert([
          { 
            email: email.trim(),
            is_active: true
          }
        ])

      if (error) throw error

      setSubmitted(true)
    } catch (err) {
      console.error('Error submitting invitation request:', err)
      setError('Failed to submit invitation request. Please try again.')
    } finally {
      setIsLoading(false)
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
            minHeight: { xs: '100vh', md: 'auto' },
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

                {/* Action Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: { xs: 1.5, sm: 2 },
                  flexDirection: { xs: 'column', sm: 'row' },
                  width: '100%',
                  maxWidth: { xs: '300px', sm: '400px' },
                  justifyContent: 'center',
                  alignItems: 'stretch',
                }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setCurrentView('signup')
                      setError(null)
                    }}
                    sx={{
                      bgcolor: '#C0FF92',
                      color: '#000',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem', lg: '1rem' },
                      px: { xs: 2.5, sm: 3, md: 3.5, lg: 4 },
                      py: { xs: 1.5, sm: 1.375, md: 1.5 },
                      borderRadius: { xs: '8px', sm: '10px', md: '12px' },
                      textTransform: 'none',
                      minHeight: { xs: '48px', sm: '44px', md: '48px' },
                      flex: { xs: 1, sm: 'none' },
                      minWidth: { xs: 'auto', sm: '130px', md: '140px' },
                      '&:hover': {
                        bgcolor: '#A8E67A',
                      },
                    }}
                  >
                    Get Started
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setCurrentView('login')
                      setError(null)
                    }}
                    sx={{
                      borderColor: '#C0FF92',
                      color: '#C0FF92',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem', lg: '1rem' },
                      px: { xs: 2.5, sm: 3, md: 3.5, lg: 4 },
                      py: { xs: 1.5, sm: 1.375, md: 1.5 },
                      borderRadius: { xs: '8px', sm: '10px', md: '12px' },
                      textTransform: 'none',
                      minHeight: { xs: '48px', sm: '44px', md: '48px' },
                      flex: { xs: 1, sm: 'none' },
                      minWidth: { xs: 'auto', sm: '130px', md: '140px' },
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
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem', lg: '0.9rem' },
                    mb: { xs: 2, sm: 2.5, md: 3 },
                    textAlign: 'center',
                    lineHeight: 1.4,
                    maxWidth: { xs: '100%', sm: '320px' },
                  }}
                >
                  Create, Analyze, summarize, and collaborate on research papers with AI
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
              <Box
                component="form"
                onSubmit={handleLogin}
                  sx={{
                  width: '100%',
                  maxWidth: { xs: '100%', sm: '380px', md: '400px' },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  }}
                >
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Welcome Back
                </Typography>

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <TextField
                    fullWidth
                  label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  />

                  <TextField
                    fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#888' }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                      }}
                />

                <LoadingButton
                  type="submit"
                    variant="contained"
                  fullWidth
                  loading={isLoading}
                    sx={{
                    mt: 2,
                      bgcolor: '#C0FF92',
                      color: '#000',
                      '&:hover': {
                        bgcolor: '#A8E67A',
                      },
                    }}
                  >
                  Sign In
                </LoadingButton>

                    <Button
                  variant="text"
                  onClick={handleBack}
                  disabled={isLoading}
                  sx={{ mt: 1, color: '#888' }}
                  >
                  Back
                  </Button>
                </Box>
            )}

            {currentView === 'signup' && (
              <Box
                component="form"
                onSubmit={handleSignup}
                  sx={{
                  width: '100%',
                  maxWidth: { xs: '100%', sm: '380px', md: '400px' },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  }}
                >
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Create Account
                </Typography>

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                {submitted ? (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    <div>
                      <strong>Account created successfully!</strong>
                      <p style={{ margin: '8px 0 0' }}>
                        Please check your email (including spam folder) for a verification link.
                      </p>
                    </div>
                  </Alert>
                ) : (
                  <>
                  <TextField
                    fullWidth
                      label="Display Name"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={isLoading}
                      required
                      autoComplete="name"
                      placeholder="How should we call you?"
                    />

                    <TextField
                      fullWidth
                      label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                      autoComplete="email"
                  />

                  <TextField
                    fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      autoComplete="new-password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: '#888' }}
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                    }}
                  />

                  <TextField
                    fullWidth
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      autoComplete="new-password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle confirm password visibility"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                              sx={{ color: '#888' }}
                            >
                              {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                    }}
                  />

                    <LoadingButton
                      type="submit"
                    variant="contained"
                      fullWidth
                      loading={isLoading}
                    sx={{
                        mt: 2,
                      bgcolor: '#C0FF92',
                      color: '#000',
                      '&:hover': {
                        bgcolor: '#A8E67A',
                      },
                    }}
                  >
                      Sign Up
                    </LoadingButton>
                  </>
                )}

                  <Button
                  variant="text"
                  onClick={handleBack}
                  disabled={isLoading}
                  sx={{ mt: 1, color: '#888' }}
                  >
                  Back
                  </Button>
                </Box>
            )}

            {/* Invitation Request Form */}
            {currentView === 'invite' && (
              <Box sx={{ width: '100%', maxWidth: '400px', mx: 'auto', p: 3 }}>
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, justifyContent: 'center' }}>
                    <AiIcon sx={{ color: '#C0FF92' }} />
                    <Typography sx={{ color: '#C0FF92', fontWeight: 500 }}>
                      Request an Invitation
                    </Typography>
                  </Box>
                  {!submitted && (
                    <Typography sx={{ color: '#888' }}>
                      Join our community of researchers
                    </Typography>
                  )}
                </Box>

                {submitted ? (
                  <>
                    <Alert severity="success" sx={{ mb: 3 }}>
                      Thank you for your interest! We'll notify you when access becomes available.
                    </Alert>
                    <Button
                      fullWidth
                      onClick={handleBack}
                      sx={{
                        color: '#888',
                        '&:hover': {
                          color: '#fff',
                          bgcolor: 'rgba(255,255,255,0.05)',
                        },
                      }}
                    >
                      Back to Home
                    </Button>
                  </>
                ) : (
                  <>
                    <form onSubmit={handleInviteRequest}>
                      <TextField
                        fullWidth
                        type="email"
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        sx={{
                          mb: 2,
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': { borderColor: '#333' },
                            '&:hover fieldset': { borderColor: '#444' },
                            '&.Mui-focused fieldset': { borderColor: '#C0FF92' },
                            '&.Mui-disabled': {
                              opacity: 0.7,
                              cursor: 'not-allowed',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#888',
                            '&.Mui-focused': { color: '#C0FF92' },
                          },
                        }}
                      />
                      {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                          {error}
                        </Alert>
                      )}
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        fullWidth
                        loading={isLoading}
                        loadingPosition="center"
                        loadingIndicator={
                          <CircularProgress 
                            size={24} 
                            sx={{ 
                              color: 'rgba(0, 0, 0, 0.7)',
                            }} 
                          />
                        }
                        sx={{
                          bgcolor: '#C0FF92',
                          color: '#111',
                          '&:hover': { bgcolor: '#a8ff66' },
                          mb: 2,
                          height: '48px',
                          '&.Mui-disabled': {
                            bgcolor: '#C0FF92',
                            opacity: 0.7,
                          },
                        }}
                      >
                        Request Invitation
                      </LoadingButton>
                    </form>
                    <Button
                      fullWidth
                      onClick={handleBack}
                      disabled={isLoading}
                      sx={{
                        color: '#888',
                        '&:hover': {
                          color: '#fff',
                          bgcolor: 'rgba(255,255,255,0.05)',
                        },
                        '&.Mui-disabled': {
                          color: '#666',
                        },
                      }}
                    >
                      Back
                    </Button>
                  </>
                )}
              </Box>
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