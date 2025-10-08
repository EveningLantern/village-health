// src/components/LandingPage.tsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  Login,
  PersonAdd,
  LocalHospital,
  MonitorHeart,
  TrackChanges,
  Public,
  Newspaper,
  PeopleAlt,
  TrendingUp,
} from '@mui/icons-material';

// Define the reusable style object for green gradient hover and rounded corners
const GreenHoverCardStyle = {
  // Rounded rectangle for containers
  borderRadius: 4, 
  // Base transition for smooth animation
  transition: 'all 0.4s cubic-bezier(.25,.8,.25,1)',
  // Initial shadow/effect
  boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
  
  // Green gradient and lift effect on hover
  '&:hover': {
    boxShadow: '0 10px 20px rgba(46, 125, 50, 0.5), 0 6px 6px rgba(46, 125, 50, 0.3)',
    transform: 'translateY(-5px)',
    background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)', // Green Gradient
    color: 'white', // Change text color to white
    
    // Target nested Typography and Icons to change their color on parent hover
    '& .MuiTypography-root, & .MuiSvgIcon-root': {
        color: 'white !important', 
    },
  },
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <Card 
    variant="outlined"
    sx={{ 
      p: 3, 
      textAlign: 'center', 
      height: '100%',
      ...GreenHoverCardStyle,
    }}
  >
    <Box sx={{ color: 'primary.main', mb: 2, '& .MuiSvgIcon-root': { fontSize: 50 } }}>
        {icon}
    </Box>
    <Typography variant="h6" gutterBottom>{title}</Typography>
    <Typography variant="body2" color="text.secondary">{description}</Typography>
  </Card>
);

const LandingPage: React.FC = () => {
  const theme = useTheme();

  // Custom green-themed button hover
  const buttonHoverStyle = {
    ...GreenHoverCardStyle,
    '&:hover': {
        ...GreenHoverCardStyle['&:hover'],
        background: 'linear-gradient(45deg, #66bb6a 30%, #388e3c 100%)', // Slightly lighter gradient for buttons
    },
    // Override the default text color change on button hover for better contrast
    '&:hover .MuiSvgIcon-root': {
        color: 'white !important',
    },
  };


  return (
    <Box sx={{ background: theme.palette.grey[50], minHeight: '100vh', pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        {/* Hero Section: The Core Message */}
        <Paper elevation={8} sx={{ borderRadius: 6, p: { xs: 3, md: 8 }, mb: 6, overflow: 'hidden' }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <LocalHospital color="primary" sx={{ fontSize: 70, mb: 2 }} />
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 700, 
                  color: 'primary.dark', 
                  mb: 2 
                }}
              >
                Protecting India's Backbone: The Village Human Resource
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 4, lineHeight: 1.5 }}>
                Villages are the critical economic and human capital drivers of India. Our platform ensures the immediate health needs of this vital population are met, supporting national growth.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<Login />}
                  sx={{ py: 1.5, px: 4, ...buttonHoverStyle }}
                >
                  Login to Access
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<PersonAdd />}
                  sx={{ py: 1.5, px: 4, ...buttonHoverStyle }}
                >
                  Join Village Health
                </Button>
              </Box>
            </Grid>

            {/* Image Placeholder: Village Focus */}
            <Grid item xs={12} md={5}>
              <Box 
                sx={{ 
                  width: '100%', 
                  height: { xs: 250, md: 400 }, 
                  borderRadius: 4, 
                  bgcolor: theme.palette.primary.light, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundImage: 'linear-gradient(160deg, #388e3c 0%, #a5d6a7 100%)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                  p: 3,
                }}
              >
                <PeopleAlt sx={{ fontSize: 120, color: 'white', opacity: 0.9, position: 'absolute' }} />
                <Typography variant="h5" sx={{ color: 'white', position: 'absolute', mt: 20 }}>
                  <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} /> Health = Economy
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Health Monitoring Features Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" textAlign="center" gutterBottom sx={{ mb: 4, fontWeight: 600, color: 'secondary.main' }}>
            Smart Monitoring & Proactive Disease Tracking
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard 
                icon={<MonitorHeart />}
                title="Real-time Health Status"
                description="Monitor the health status of registered villagers through a simplified symptom reporting and tracking interface."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard 
                icon={<TrackChanges />}
                title="Early Disease Detection"
                description="Advanced algorithms track clusters of reported symptoms, alerting health administrators to potential disease outbreaks and trends."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard 
                icon={<Public />}
                title="Location-Based Triage"
                description="Pinpoint geographical location of reports to optimize resource allocation and doctor dispatch for emergency cases."
              />
            </Grid>
          </Grid>
        </Box>

        {/* Article Section (Bottom Left) and Placeholder Footer */}
        <Grid container spacing={4}>
          {/* Article Section - Bottom Left */}
          <Grid item xs={12} md={6}>
            <Card sx={{ ...GreenHoverCardStyle, p: 3, bgcolor: theme.palette.primary.light + '10', height: '100%', '&:hover': { ...GreenHoverCardStyle['&:hover'], background: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Newspaper color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" color="primary.dark" fontWeight={600}>
                  Article Spotlight
                </Typography>
              </Box>
              <Box sx={{ borderLeft: `3px solid ${theme.palette.secondary.main}`, pl: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Digital Health: A New Era for Rural Livelihoods
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  By providing quick access to consultations and centralized health records, we reduce travel time and expense, keeping our village workforce healthy and productive. This digital shift is crucial for empowering the entire community.
                </Typography>
                <Button variant="text" size="small" color="secondary">
                  Continue Reading
                </Button>
              </Box>
            </Card>
          </Grid>
          
          {/* Contact/Demo Placeholder - Bottom Right */}
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                bgcolor: theme.palette.grey[100], 
                p: 5, 
                borderRadius: 4, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center',
                boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
              }}
            >
              <Typography variant="h5" gutterBottom color="secondary.dark">
                Have Questions?
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Explore the platform now or contact our support team for a demo.
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                sx={{ py: 1, px: 3 , maxWidth: 250, mx: 'auto', ...buttonHoverStyle, '&:hover': { ...buttonHoverStyle['&:hover'], color: 'white' } }}
              >
                Request a Demo
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;