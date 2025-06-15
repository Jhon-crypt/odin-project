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
} from '@mui/material'
import {
  Close as CloseIcon,
  Key as KeyIcon,
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
  const { selectedLLM: storedLLM, apiKey: storedApiKey, setLLM, loadStoredSettings } = useLLMStore()
  const [selectedLLM, setSelectedLLM] = useState<string | null>(storedLLM)
  const [apiKey, setApiKey] = useState(storedApiKey || '')

  // Load stored settings when modal opens
  useEffect(() => {
    if (open) {
      loadStoredSettings().then(() => {
        // Update local state with loaded settings
        setSelectedLLM(storedLLM)
        if (storedApiKey) setApiKey(storedApiKey)
      })
    }
  }, [open, loadStoredSettings, storedLLM, storedApiKey])

  const handleSave = async () => {
    if (selectedLLM && apiKey) {
      try {
        await setLLM(selectedLLM, apiKey)
        onClose()
      } catch (error) {
        console.error('Error saving LLM settings:', error)
        // You might want to show an error message to the user here
      }
    }
  }

  return (
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
            disabled={loading}
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
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            disabled={loading}
            InputProps={{
              startAdornment: <KeyIcon sx={{ color: '#888', mr: 1 }} />,
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
            disabled={!selectedLLM || !apiKey || loading}
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
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default LLMModal 