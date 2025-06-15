import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, CircularProgress } from '@mui/material'
import { supabase } from '../lib/supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the session from URL
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) throw sessionError

        if (!session) {
          // If no session, try to exchange the code for a session
          const { error: signInError } = await supabase.auth.exchangeCodeForSession(window.location.hash)
          if (signInError) throw signInError
        }

        // Redirect to dashboard
        navigate('/dashboard')
      } catch (err) {
        console.error('Error during email confirmation:', err)
        setError('Failed to verify email. Please try again.')
      }
    }

    handleEmailConfirmation()
  }, [navigate])

  if (error) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#111111',
          color: '#ffffff',
          p: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom color="error">
          {error}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          You can try logging in again from the home page.
        </Typography>
        <Typography
          component="a"
          href="/"
          sx={{
            color: '#C0FF92',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Go to Home
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#111111',
        color: '#ffffff',
        p: 3,
        textAlign: 'center',
      }}
    >
      <CircularProgress sx={{ color: '#C0FF92', mb: 3 }} />
      <Typography variant="h5" component="h1" gutterBottom>
        Verifying your email...
      </Typography>
      <Typography variant="body1">
        Please wait while we complete the verification process.
      </Typography>
    </Box>
  )
} 