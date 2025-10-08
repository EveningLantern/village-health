import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import NotificationCenter from '../Notifications/NotificationCenter'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Button,
  useTheme,
  Tooltip,
} from '@mui/material'
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Dashboard,
  Report,
  Chat,
  History,
  Language,
  PeopleAlt, // For Users (Admin)
  Assessment, // For Analytics (Admin)
  ChevronLeft, // Icon for collapse
  ChevronRight, // Icon for expand
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'

// --- Custom Constants for Sidebar ---
const SIDEBAR_WIDTH_ICON = 72; // Width of the collapsed, icon-only sidebar
const SIDEBAR_WIDTH_EXPANDED = 240; // Standard width for drawer/expanded sidebar

const Layout: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false); // Mobile drawer state
  // Start expanded for better initial UX, or start collapsed (false) for the icon-only look
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); // Desktop persistent sidebar state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const { user, logout } = useAuth();
  const { showToast } = useNotifications();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();

  // Navigation Items Logic
  const getNavigationItems = (role: string | undefined) => {
    const baseItems = [
      // Dashboard is now the homepage for the role
      { text: t('dashboard'), icon: <Dashboard />, path: `/${role}` },
      { text: t('profile'), icon: <AccountCircle />, path: `/${role}/profile` },
    ];

    switch (role) {
      case 'villager':
        return [
          ...baseItems,
          { text: t('reportHealth'), icon: <Report />, path: '/villager/report' },
          { text: t('myReports'), icon: <History />, path: '/villager/reports' },
          { text: t('consultations'), icon: <Chat />, path: '/villager/consultations' },
        ];
      case 'doctor':
        return [
          ...baseItems,
          { text: t('patientReports'), icon: <Report />, path: '/doctor/reports' },
          { text: t('activeConsultations'), icon: <Chat />, path: '/doctor/consultations' },
          { text: t('medicalHistory'), icon: <History />, path: '/doctor/history' },
        ];
      case 'admin':
        return [
          ...baseItems,
          { text: 'Users', icon: <PeopleAlt />, path: '/admin/users' },
          { text: 'Reports', icon: <Report />, path: '/admin/reports' },
          { text: 'Analytics', icon: <Assessment />, path: '/admin/analytics' },
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavigationItems(user?.role);
  // Simple check for active path (adjust as needed for deeper nesting)
  const currentPath = window.location.pathname;

  // --- Profile Dropdown Handlers ---
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  // --- Logout Handler ---
  const handleLogout = () => {
    logout();
    showToast('Logout Successful', { severity: 'success', autoHideDuration: 3500 });
    navigate('/'); // Redirect to landing page
  };

  // --- Language Toggle ---
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };
  
  // --- Profile Dropdown Component (Mimics NavUser structure) ---
  const ProfileDropdown = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleProfileMenuClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            minWidth: 200,
            boxShadow: theme.shadows[10],
          }
        }
      }}
      // Align dropdown next to the avatar/trigger button
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {/* Header/Label mimicking DropdownMenuLabel in NavUser */}
      <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
          {user?.fullName.charAt(0)}
        </Avatar>
        <Box sx={{ lineHeight: 1.2 }}>
          <Typography variant="body2" fontWeight={600} sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.fullName}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.email}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 0.5 }} />
      
      {/* Menu Group 1 */}
      <MenuItem onClick={() => { navigate(`/${user?.role}/profile`); handleProfileMenuClose(); }}>
        <AccountCircle sx={{ mr: 1, fontSize: 20 }} />
        {t('profile')}
      </MenuItem>
      <MenuItem onClick={() => { navigate(`/${user?.role}/consultations`); handleProfileMenuClose(); }}>
        <Chat sx={{ mr: 1, fontSize: 20 }} />
        {t('consultations')}
      </MenuItem>
      <Divider sx={{ my: 0.5 }} />

      {/* Logout */}
      <MenuItem onClick={handleLogout} sx={{ color: theme.palette.error.main }}>
        <Logout sx={{ mr: 1, fontSize: 20 }} />
        {t('logout')}
      </MenuItem>
    </Menu>
  );

  // --- Desktop Persistent Sidebar (Mimicking AppSidebar Left Pane) ---
  const PermanentSidebar = (
    <Box
      sx={{
        width: isSidebarExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_ICON,
        flexShrink: 0,
        height: '100vh',
        bgcolor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        overflowX: 'hidden',
        overflowY: 'auto',
        position: 'fixed',
        top: 0,
        zIndex: theme.zIndex.drawer,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        display: { xs: 'none', md: 'flex' }, // Only show on desktop
        flexDirection: 'column',
      }}
    >
      {/* Header with App Title/Icon and Collapse Button */}
      <Toolbar 
        disableGutters 
        sx={{ 
          minHeight: 64, // Standard Toolbar height
          px: isSidebarExpanded ? 2 : 0, 
          justifyContent: isSidebarExpanded ? 'space-between' : 'center',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: isSidebarExpanded ? 'block' : 'none', ml: 1, width: '100%', overflow: 'hidden' }}>
          <Typography variant="h6" color="primary" fontWeight={600} noWrap>
            Village Health
          </Typography>
        </Box>
        <IconButton 
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          // Position icon correctly when expanded/collapsed
          sx={{ ml: isSidebarExpanded ? 0 : 1, transition: 'none' }} 
        >
          {isSidebarExpanded ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Toolbar>
      
      {/* Main Navigation Menu */}
      <List component="nav" sx={{ flexGrow: 1, py: 1 }}>
        {navItems.map((item) => {
          // Declare isActive with 'let' so it can be reassigned
          let isActive = false; 
          const cleanPath = item.path.replace('/*', '');
          
          // Default check for active path
          isActive = currentPath.startsWith(cleanPath) && cleanPath !== `/${user?.role}` || currentPath === cleanPath;
          
          // Special case for dashboard: only active if the path matches the root role path exactly
          if (item.text === t('dashboard')) {
              const rootPath = `/${user?.role}`;
              // Reassigning isActive is now safe because it's declared with 'let'
              isActive = currentPath === rootPath || currentPath === `${rootPath}/`;
          }
          
          return (
            <Tooltip 
              title={item.text} 
              placement="right" 
              key={item.text}
              // Disable tooltip if sidebar is expanded, as the label is visible
              disableFocusListener={isSidebarExpanded}
              disableHoverListener={isSidebarExpanded}
              disableTouchListener={isSidebarExpanded}
            >
              <ListItem 
                button 
                onClick={() => navigate(cleanPath)}
                sx={{ 
                  justifyContent: isSidebarExpanded ? 'initial' : 'center',
                  minHeight: 48,
                  px: 2,
                  mx: 1,
                  borderRadius: 2,
                  my: 0.5,
                  transition: 'background-color 0.3s, color 0.3s',
                  bgcolor: isActive ? theme.palette.primary.main + '10' : 'transparent',
                  color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                  '&:hover': {
                      bgcolor: theme.palette.primary.light + '20',
                  },
                }}
              >
                <ListItemIcon
                  sx={{ 
                    minWidth: 0, 
                    mr: isSidebarExpanded ? 3 : 'auto', 
                    justifyContent: 'center',
                    color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                    transition: 'color 0.3s',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ opacity: isSidebarExpanded ? 1 : 0 }} 
                />
              </ListItem>
            </Tooltip>
          );
        })}
      </List>

      {/* Footer/NavUser Section (visible when expanded for direct logout/profile) */}
      <Box sx={{ p: 1, borderTop: `1px solid ${theme.palette.divider}`, mb: 1 }}>
        {/* Only show the full NavUser style when expanded, otherwise rely on AppBar Icon */}
        <Box 
          onClick={handleProfileMenuOpen}
          sx={{ 
            display: isSidebarExpanded ? 'flex' : 'none', 
            alignItems: 'center', 
            gap: 1, 
            p: 1, 
            borderRadius: 2,
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            '&:hover': { bgcolor: theme.palette.action.hover }
          }}
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
            {user?.fullName.charAt(0)}
          </Avatar>
          <Box sx={{ lineHeight: 1.2, overflow: 'hidden' }}>
            <Typography variant="body2" fontWeight={600} noWrap>{user?.fullName}</Typography>
            <Typography variant="caption" color="text.secondary" noWrap>{user?.email}</Typography>
          </Box>
        </Box>
        
        {/* Show a logout icon when collapsed */}
        <Tooltip title={t('logout')} placement="right" disableFocusListener disableHoverListener={isSidebarExpanded} disableTouchListener={isSidebarExpanded}>
            <IconButton 
                onClick={handleLogout}
                sx={{ 
                    display: isSidebarExpanded ? 'none' : 'flex', 
                    width: '100%', 
                    borderRadius: 2,
                    justifyContent: 'center',
                    color: theme.palette.error.main,
                    transition: 'background-color 0.3s',
                    '&:hover': { bgcolor: theme.palette.error.main + '10' }
                }}
            >
                <Logout />
            </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  // --- Mobile Temporary Drawer ---
  const MobileDrawer = (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      sx={{
        display: { xs: 'block', md: 'none' }, // Only show on mobile/tablet
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: SIDEBAR_WIDTH_EXPANDED },
      }}
    >
      {/* Mobile Drawer Content */}
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" color="primary" fontWeight={600}>
          Village Health
        </Typography>
        <IconButton onClick={() => setDrawerOpen(false)}>
          <ChevronLeft />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            onClick={() => {
              navigate(item.path.replace('/*', ''));
              setDrawerOpen(false);
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <Divider />
        <ListItem button onClick={handleLogout} sx={{ color: theme.palette.error.main }}>
          <ListItemIcon><Logout color="error" /></ListItemIcon>
          <ListItemText primary={t('logout')} />
        </ListItem>
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="body2" color="text.secondary">
            Logged in as: {user?.email}
          </Typography>
      </Box>
    </Drawer>
  );
  
  const sidebarWidth = isSidebarExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_ICON;
  const desktopSidebarSpacing = { 
    // Shift content and AppBar to the right by the width of the permanent sidebar
    ml: { md: `${sidebarWidth}px` } 
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', ...desktopSidebarSpacing }}>
      
      {/* Desktop Persistent Sidebar (Shadcn style left pane) */}
      {PermanentSidebar}
      
      {/* Mobile Drawer */}
      {MobileDrawer}
      
      {/* Main Content Area and AppBar */}
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: theme.zIndex.drawer + 1,
            // Adjust AppBar width and position for permanent sidebar
            ml: { md: `${sidebarWidth}px` },
            width: { md: `calc(100% - ${sidebarWidth}px)` },
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar>
            {/* Menu icon only for mobile/tablet */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setDrawerOpen(true)}
              edge="start"
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Village Health - {user?.fullName}
            </Typography>

            <IconButton color="inherit" onClick={toggleLanguage}>
              <Language />
            </IconButton>

            <NotificationCenter />

            {/* Profile IconButton: Always visible in AppBar when sidebar is collapsed */}
            <IconButton
              edge="end"
              aria-label="account of current user"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ display: { xs: 'block', md: isSidebarExpanded ? 'none' : 'block' } }}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.fullName.charAt(0)}
              </Avatar>
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Profile Menu (Dropdown) */}
        {ProfileDropdown}

        {/* Main Content */}
        {/* Adds padding-top for the fixed AppBar and padding-left for the permanent sidebar */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 10 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default Layout
