import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import PublicResearch from './pages/PublicResearch'
import AuthCallback from './pages/AuthCallback'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ProjectPage from './pages/ProjectPage'
import useLLMStore from './store/llmStore'

// Separate component to handle LLM initialization after auth
function LLMInitializer() {
  const { user, loading } = useAuth()
  const { loadStoredSettings, initialized } = useLLMStore()

  useEffect(() => {
    const initializeLLM = async () => {
      if (!loading && user && !initialized) {
        try {
          await loadStoredSettings()
        } catch (error) {
          console.error('Error loading LLM settings:', error)
        }
      }
    }

    initializeLLM()
  }, [user, loading, initialized, loadStoredSettings])

  return null
}

function AppRoutes() {
  return (
    <Router>
      <LLMInitializer />
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
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App 