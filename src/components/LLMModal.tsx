import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar,
  InputAdornment,
} from '@mui/material'
import {
  Close as CloseIcon,
  Key as KeyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material'
import { useState, useEffect } from 'react'
import useLLMStore from '../store/llmStore'

interface LLMModalProps {
  open: boolean
  onClose: () => void
  llmOptions: Array<{
    id: string
    name: string
    provider: string
    description?: string
  }>
  loading?: boolean
}

function LLMModal({ open, onClose, llmOptions, loading = false }: LLMModalProps) {
  const { selectedLLM: storedLLM, apiKey: storedApiKey, setLLM, loadStoredSettings, isLoading: storeLoading, error: storeError } = useLLMStore()
  const [selectedLLM, setSelectedLLM] = useState<string | null>(storedLLM)
  const [apiKey, setApiKey] = useState(storedApiKey || '')
  const [showApiKey, setShowApiKey] = useState(false)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  // Update local state when store values change
  useEffect(() => {
    if (storedLLM !== null) {
      setSelectedLLM(storedLLM)
    }
    if (storedApiKey !== null) {
      setApiKey(storedApiKey)
    }
  }, [storedLLM, storedApiKey])

  // Load stored settings when modal opens
  useEffect(() => {
    if (open) {
      const loadSettings = async () => {
        try {
          await loadStoredSettings()
        } catch (error) {
          setFeedback({
            type: 'error',
            message: error instanceof Error ? error.message : 'Failed to load settings'
          })
        }
      }
      loadSettings()
    }
  }, [open, loadStoredSettings])

  // Update feedback when store error changes
  useEffect(() => {
    if (storeError) {
      setFeedback({
        type: storeError.includes('will be updated') ? 'success' : 'error',
        message: storeError
      })
    }
  }, [storeError])

  const handleSave = async () => {
    if (selectedLLM && apiKey) {
      setSaving(true)
      try {
        await setLLM(selectedLLM, apiKey)
        setFeedback({ type: 'success', message: 'LLM configuration saved successfully!' })
        setTimeout(() => {
          onClose()
          setFeedback(null)
        }, 1500)
      } catch {
        // Error is already handled by the store and will update feedback via the effect
      } finally {
        setSaving(false)
      }
    }
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="llm-modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            bgcolor: '#1a1a1a',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography
              id="llm-modal-title"
              variant="h6"
              sx={{ color: '#fff', fontWeight: 'bold' }}
            >
              Configure LLM
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{ color: '#888' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="llm-select-label" sx={{ color: '#888' }}>
              Select LLM
            </InputLabel>
            <Select
              labelId="llm-select-label"
              value={selectedLLM || ''}
              onChange={(e) => setSelectedLLM(e.target.value)}
              disabled={loading || saving}
              sx={{
                color: '#fff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#333',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#C0FF92',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#C0FF92',
                },
                '& .MuiSvgIcon-root': {
                  color: '#888',
                },
              }}
            >
              {loading ? (
                <MenuItem disabled>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={20} sx={{ color: '#C0FF92' }} />
                    <Typography>Loading models...</Typography>
                  </Box>
                </MenuItem>
              ) : (
                llmOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body1">
                        {option.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#888' }}>
                        {option.provider}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <TextField
              label="API Key"
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={loading || saving}
              InputProps={{
                startAdornment: <KeyIcon sx={{ color: '#888', mr: 1 }} />,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowApiKey(!showApiKey)}
                      edge="end"
                      sx={{ color: '#888', '&:hover': { color: '#C0FF92' } }}
                    >
                      {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': {
                    borderColor: '#333',
                  },
                  '&:hover fieldset': {
                    borderColor: '#C0FF92',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#C0FF92',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#888',
                  '&.Mui-focused': {
                    color: '#C0FF92',
                  },
                },
              }}
            />
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              onClick={onClose}
              disabled={saving || storeLoading}
              sx={{
                color: '#ccc',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!selectedLLM || !apiKey || loading || saving || storeLoading}
              variant="contained"
              sx={{
                bgcolor: '#C0FF92',
                color: '#000',
                '&:hover': {
                  bgcolor: '#a8ff6a',
                },
                '&.Mui-disabled': {
                  bgcolor: '#333',
                  color: '#666',
                },
              }}
            >
              {saving || storeLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: '#000' }} />
                  <span>Saving...</span>
                </Box>
              ) : (
                'Save'
              )}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={!!feedback}
        autoHideDuration={3000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={feedback?.type || 'success'}
          sx={{ 
            bgcolor: feedback?.type === 'success' ? '#C0FF92' : '#ff6b6b',
            color: '#000',
            '& .MuiAlert-icon': {
              color: '#000'
            }
          }}
        >
          {feedback?.message || ''}
        </Alert>
      </Snackbar>
    </>
  )
}

export default LLMModal 