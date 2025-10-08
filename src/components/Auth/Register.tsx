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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  // Removed useTheme from here
} from '@mui/material'
import { Language, Visibility, VisibilityOff, LocalHospital } from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    role: '' as 'villager' | 'doctor' | 'admin' | '',
    specialization: '',
    licenseNumber: '',
    village: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { showToast } = useNotifications()
  const theme = useTheme()

  const handleChange = (field: string) => (e: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    // FIX: Check if the role field is explicitly the empty string.
    if (formData.role === '') { 
      setError('Please select a role')
      return
    }

    if (formData.role === 'doctor' && (!formData.specialization || !formData.licenseNumber)) {
      setError('Specialization and License Number are required for doctors')
      return
    }

    if (formData.role === 'villager' && !formData.village) {
      setError('Village name is required for villagers')
      return
    }

    setLoading(true)

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        role: formData.role as 'villager' | 'doctor' | 'admin',
        specialization: formData.role === 'doctor' ? formData.specialization : undefined,
        licenseNumber: formData.role === 'doctor' ? formData.licenseNumber : undefined,
        village: formData.role === 'villager' ? formData.village : undefined,
      }
      await register(payload)
      showToast('Registered Successfully', { severity: 'success', autoHideDuration: 3500 })
      
      // Navigate based on user role
      switch (formData.role) {
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
          navigate('/')
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed')
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
          marginTop: 4,
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
              <Box className="flex size-10 items-center justify-center rounded-md" sx={{ bgcolor: theme.palette.primary.main + '20', borderRadius: '8px' }}>
                <LocalHospital color="primary" className="size-6" sx={{ fontSize: 32 }} />
              </Box>
            </Box>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
              Create Your Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('register')} to access healthcare services
              {/* Login link as description field */}
              <Typography variant="body2" component="span" sx={{ display: 'block', mt: 1 }}>
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none', color: theme.palette.primary.main, fontWeight: 600 }}>
                  {t('login')}
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
              
              {/* Full Name Field */}
              <Box>
                <Typography component="label" htmlFor="fullName" sx={{ display: 'block', fontWeight: 600, mb: 0.5 }}>{t('fullName')}</Typography>
                <TextField
                  required
                  fullWidth
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  placeholder="John Doe"
                  autoFocus
                  value={formData.fullName}
                  onChange={handleChange('fullName')}
                  size="medium"
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Box>
            
              {/* Email Field */}
              <Box>
                <Typography component="label" htmlFor="email" sx={{ display: 'block', fontWeight: 600, mb: 0.5 }}>{t('email')}</Typography>
                <TextField
                  required
                  fullWidth
                  id="email"
                  name="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange('email')}
                  size="medium"
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Box>

              {/* Phone Number Field */}
              <Box>
                <Typography component="label" htmlFor="phoneNumber" sx={{ display: 'block', fontWeight: 600, mb: 0.5 }}>{t('phoneNumber')}</Typography>
                <TextField
                  required
                  fullWidth
                  id="phoneNumber"
                  name="phoneNumber"
                  autoComplete="tel"
                  placeholder="+91-9876543210"
                  value={formData.phoneNumber}
                  onChange={handleChange('phoneNumber')}
                  size="medium"
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Box>

              {/* Role Select */}
              <Box>
                <Typography component="label" htmlFor="role" sx={{ display: 'block', fontWeight: 600, mb: 0.5 }}>{t('selectRole')}</Typography>
                <FormControl fullWidth required size="medium">
                  <Select
                    value={formData.role}
                    onChange={handleChange('role')}
                    id="role"
                    displayEmpty
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                    renderValue={(selected) => {
                      if(false) {
                        return <Typography sx={{ color: theme.palette.text.disabled }}>Select your role...</Typography>;
                      }
                      return t(selected);
                    }}
                  >
                    <MenuItem value="" disabled>Select your role...</MenuItem>
                    <MenuItem value="villager">{t('villager')}</MenuItem>
                    <MenuItem value="doctor">{t('doctor')}</MenuItem>
                    <MenuItem value="admin">{t('admin')}</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Conditional fields based on role */}
              {formData.role === 'doctor' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Typography component="label" htmlFor="specialization" sx={{ display: 'block', fontWeight: 600, mb: 0.5 }}>Specialization</Typography>
                    <TextField
                      required
                      fullWidth
                      id="specialization"
                      name="specialization"
                      placeholder="e.g., General Medicine"
                      value={formData.specialization}
                      onChange={handleChange('specialization')}
                      size="medium"
                      variant="outlined"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Box>
                  <Box>
                    <Typography component="label" htmlFor="licenseNumber" sx={{ display: 'block', fontWeight: 600, mb: 0.5 }}>License Number</Typography>
                    <TextField
                      required
                      fullWidth
                      id="licenseNumber"
                      name="licenseNumber"
                      placeholder="e.g., MED12345"
                      value={formData.licenseNumber}
                      onChange={handleChange('licenseNumber')}
                      size="medium"
                      variant="outlined"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Box>
                </Box>
              )}

              {formData.role === 'villager' && (
                <Box>
                  <Typography component="label" htmlFor="village" sx={{ display: 'block', fontWeight: 600, mb: 0.5 }}>Village Name</Typography>
                  <TextField
                    required
                    fullWidth
                    id="village"
                    name="village"
                    placeholder="e.g., Rampur Village"
                    value={formData.village}
                    onChange={handleChange('village')}
                    size="medium"
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Box>
              )}

              {/* Password Field */}
              <Box>
                <Typography component="label" htmlFor="password" sx={{ display: 'block', fontWeight: 600, mb: 0.5 }}>{t('password')}</Typography>
                <TextField
                  required
                  fullWidth
                  name="password"
                  id="password"
                  autoComplete="new-password"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange('password')}
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

              {/* Confirm Password Field */}
              <Box>
                <Typography component="label" htmlFor="confirmPassword" sx={{ display: 'block', fontWeight: 600, mb: 0.5 }}>{t('confirmPassword')}</Typography>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  placeholder="********"
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  size="medium"
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Box>
              
              {/* Register Button (Button equivalent) */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 1, 
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: 2,
                  // Green gradient and hover effect
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.success.light} 90%)`,
                  boxShadow: '0 3px 5px 2px rgba(46, 125, 50, .3)',
                  transition: '0.3s',
                  '&:hover': {
                    background: theme.palette.primary.dark,
                    boxShadow: '0 4px 8px 3px rgba(46, 125, 50, .4)',
                  }
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : t('register')}
              </Button>
            </Box>
          </Box>
        </Paper>
        
        {/* Footer Text (FieldDescription equivalent) */}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 3, px: 3, textAlign: 'center' }}>
          By clicking continue, you agree to our <Link to="#" style={{ color: theme.palette.secondary.main, textDecoration: 'none' }}>Terms of Service</Link>{' '}
          and <Link to="#" style={{ color: theme.palette.secondary.main, textDecoration: 'none' }}>Privacy Policy</Link>.
        </Typography>
      </Box>
    </Container>
  )
}

export default Register
