import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import PublicResearch from './pages/PublicResearch'
import AuthCallback from './pages/AuthCallback'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import ProjectPage from './pages/ProjectPage'
import useLLMStore from './store/llmStore'
import { supabase } from './lib/supabaseClient'

function App() {
  const { loadStoredSettings, initialized } = useLLMStore()

  // Load stored LLM settings when app starts or auth state changes
  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (!initialized) {
          await loadStoredSettings()
        }
      } catch (error) {
        console.error('Error loading LLM settings:', error)
      }
    }

    // Initial load
    loadSettings()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        loadSettings()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [loadStoredSettings, initialized])

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/research/:id" element={<PublicResearch />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App 