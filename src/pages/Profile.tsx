import {
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Typography,
} from '@mui/material'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ResearchProfileHeader from '../components/ResearchProfileHeader'
import ResearchHistoryCard from '../components/ResearchHistoryCard'
import ResearchTable from '../components/ResearchTable'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
  updated_at: string;
}

function Profile() {
  const { email } = useParams<{ email: string }>()
  const { user } = useAuth()
  const [profileData, setProfileData] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single()

        if (fetchError) throw fetchError

        setProfileData(data)
      } catch (err) {
        console.error('Error fetching user profile:', err)
        setError('Failed to load user profile')
      } finally {
        setLoading(false)
      }
    }

    if (email) {
      fetchUserProfile()
    }
  }, [email])

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
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  })

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            bgcolor: '#111111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6" sx={{ color: '#fff' }}>
            Loading profile...
          </Typography>
        </Box>
      </ThemeProvider>
    )
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            bgcolor: '#111111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6" sx={{ color: '#ff6b6b' }}>
            {error}
          </Typography>
        </Box>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#111111',
          pb: { xs: 2, sm: 3, md: 4 },
          width: '100vw',
          maxWidth: 'none',
          margin: 0,
          padding: 0,
          overflow: 'auto',
        }}
      >
        <Box sx={{ 
          px: { xs: 1, sm: 2, md: 3, lg: 4 }, 
          pt: { xs: 1, sm: 2, md: 3 }, 
          width: '100%', 
          maxWidth: 'none',
          margin: '0 auto'
        }}>
          {/* Profile Header */}
          <ResearchProfileHeader userData={profileData} isOwnProfile={user?.email === email} />

          {/* Main Content */}
          <Box sx={{ 
            mt: { xs: 1, sm: 2 },
            maxWidth: { xs: '100%', lg: '1400px' },
            margin: '0 auto'
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: { xs: 1.5, sm: 2, md: 3 } 
            }}>
              {/* Research History */}
              <ResearchHistoryCard userId={profileData?.id} />
              
              {/* Research Projects Table */}
              <ResearchTable userId={profileData?.id} />
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default Profile 