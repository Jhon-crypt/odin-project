import { useState } from 'react'
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Box,
  Grid,
  Fab,
  IconButton,
} from '@mui/material'
import {
  Add as AddIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material'

function App() {
  const [count, setCount] = useState(0)
  const [darkMode, setDarkMode] = useState(false)

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  })

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            React + Vite + Material UI
          </Typography>
          <IconButton color="inherit" onClick={toggleDarkMode}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <IconButton
            color="inherit"
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                  Welcome to Your App
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                  Built with React, Vite, and Material UI
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setCount((count) => count + 1)}
                    sx={{ mr: 2 }}
                  >
                    Count is {count}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => setCount(0)}
                  >
                    Reset
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  ⚡ Vite
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Next generation frontend tooling. It's fast!
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  ⚛️ React
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  A JavaScript library for building user interfaces.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  🎨 Material UI
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  React components for faster and easier web development. Build your own design system, or start with Material Design.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" sx={{ mr: 1 }}>
                    Primary
                  </Button>
                  <Button variant="outlined" sx={{ mr: 1 }}>
                    Secondary
                  </Button>
                  <Button variant="text">
                    Text
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 4 }}
        >
          Edit <code>src/App.tsx</code> and save to test HMR
        </Typography>
      </Container>

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => setCount((count) => count + 1)}
      >
        <AddIcon />
      </Fab>
    </ThemeProvider>
  )
}

export default App
