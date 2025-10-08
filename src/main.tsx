import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App.tsx'
import './i18n/config.ts'
import 'leaflet/dist/leaflet.css'

// New Color Palette: #118B50 (Primary Dark), #5DB996 (Primary Medium/Light), #E3F0AF (Accent)
const theme = createTheme({
  palette: {
    primary: {
      main: '#118B50', // Deep Green/Emerald
      light: '#5DB996', // Medium Teal/Green for gradients/accents
    },
    secondary: {
      main: '#5DB996', // Setting secondary to the medium green accent
    },
    success: {
      main: '#118B50', // Aligning success with the new primary main color
      light: '#5DB996',
    },
    background: {
        default: '#FFFFFF', // Setting general background to white
        paper: '#FFFFFF',   // Setting component background to white
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)