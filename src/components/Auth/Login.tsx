import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTheme } from '@mui/material/styles' 
import { useTranslation } from 'react-i18next'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'
import { Language, Visibility, VisibilityOff, LocalHospital } from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { showToast } = useNotifications()
  const theme = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      
      // Show login success toast
      showToast('Login Successful', { severity: 'success', autoHideDuration: 3500 })
      
      // Navigate based on user role (will be handled by the auth context)
      const user = JSON.parse(localStorage.getItem('villageHealthUser') || '{}')
      switch (user.role) {
        case 'villager':
          navigate('/villager')
          break
        case 'doctor':
          navigate('/doctor')
          break
        case 'admin':
          navigate('/admin')
          break
        default:
          navigate('/') // Navigate to landing page if role is unknown
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Language Selector */}
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <FormControl size="small">
            <InputLabel>Language</InputLabel>
            <Select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              startAdornment={<Language sx={{ mr: 0.5 }} />}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="hi">हिंदी</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Paper 
          elevation={4} 
          sx={{ 
            padding: { xs: 3, sm: 5 }, 
            width: '100%', 
            borderRadius: 3, 
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)' 
          }}
        >
          
          {/* Header mimicking shadcn style */}
          <Box className="flex flex-col items-center gap-2 text-center" sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, fontWeight: 500 }}>
              <Box className="flex size-10 items-center justify-center rounded-md" sx={{ bgcolor: '#FBF6E9', borderRadius: '8px' }}>
                <LocalHospital color="primary" className="size-6" sx={{ fontSize: 32 }} />
              </Box>
            </Box>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
              {t('welcome')} back to Village Health
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('login')} to access healthcare services
              {/* Sign up link as description field */}
              <Typography variant="body2" component="span" sx={{ display: 'block', mt: 1 }}>
                Don&apos;t have an account?{' '}
                <Link to="/register" style={{ textDecoration: 'none', color: theme.palette.primary.main, fontWeight: 600 }}>
                  {t('register')}
                </Link>
              </Typography>
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {/* FieldGroup equivalent: flex column with gap */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Email Field */}
              <Box>
                {/* FieldLabel equivalent */}
                <Typography component="label" htmlFor="email" sx={{ display: 'block', fontWeight: 600, mb: 0.5 }}>{t('email')}</Typography>
                <TextField
                  required
                  fullWidth
                  id="email"
                  name="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="medium"
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Box>

              {/* Password Field */}
              <Box>
                {/* FieldLabel equivalent */}
                <Typography component="label" htmlFor="password" sx={{ display: 'block', fontWeight: 600, mb: 0.5 }}>{t('password')}</Typography>
                <TextField
                  required
                  fullWidth
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="medium"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    )
                  }}
                />
              </Box>

              {/* Login Button (Button equivalent) */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: 2,
                  // Green gradient and hover effect using new palette: #118B50 and #5DB996
                  background: `linear-gradient(45deg, #118B50 30%, #5DB996 90%)`,
                  boxShadow: '0 3px 5px 2px rgba(17, 139, 80, .3)',
                  transition: '0.3s',
                  '&:hover': {
                    background: theme.palette.primary.dark,
                    boxShadow: '0 4px 8px 3px rgba(17, 139, 80, .4)',
                  }
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : t('login')}
              </Button>
            </Box>
          </Box>
        </Paper>
        
        {/* Footer Text (FieldDescription equivalent) */}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 3, px: 3, textAlign: 'center' }}>
          By clicking continue, you agree to our <Link to="#" style={{ color: theme.palette.secondary.main, textDecoration: 'none' }}>Terms of Service</Link>{' '}
          and <Link to="#" style={{ color: theme.palette.secondary.main, textDecoration: 'none' }}>Privacy Policy</Link>.
        </Typography>

        {/* Removed Demo Credentials as per design request */}
      </Box>
    </Container>
  )
}

export default Login