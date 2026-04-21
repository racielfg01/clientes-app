import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  AppBar, Toolbar, Typography, Button, Drawer, List, 
  ListItem, ListItemText, Box, IconButton, useMediaQuery, 
  useTheme, Avatar, Menu, MenuItem, 
  Paper
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: 'INICIO', icon: <HomeIcon />, path: '/home' },
    { text: 'Cuentas Clientes', icon: <PeopleIcon />, path: '/clientes' },
    { text: 'Gestionar Intereses', icon: <CategoryIcon />, path: '/intereses' },
  ];

  const drawerWidth = isMobile ? 240 : 280;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: isMobile ? 1 : 2 }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant={isMobile ? "subtitle1" : "h6"} 
            sx={{ flexGrow: 1 }}
          >
            Sistema de Clientes
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && (
              <Typography variant="body2" sx={{ mr: 1 }}>
                {user?.username}
              </Typography>
            )}
            <IconButton 
              color="inherit" 
              onClick={handleMenuOpen}
              size={isMobile ? "small" : "medium"}
            >
              <AccountCircleIcon />
            </IconButton>
            {!isMobile && (
              <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                Salir
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem disabled>
          <Typography variant="body2">{user?.username}</Typography>
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Cerrar Sesión
        </MenuItem>
      </Menu>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom>
            Menú
          </Typography>
          {isMobile && (
            <Typography variant="body2" color="textSecondary">
              {user?.username}
            </Typography>
          )}
        </Box>
        <List sx={{ pt: 1 }}>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text}
              onClick={() => { 
                navigate(item.path); 
                setDrawerOpen(false); 
              }}
              sx={{
                py: isMobile ? 1.5 : 2,
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                {item.icon}
              </Box>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{ 
                  variant: isMobile ? 'body2' : 'body1',
                  fontWeight: 'medium'
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: isMobile ? 2 : isTablet ? 3 : 4,
          bgcolor: 'background.default',
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        <Paper 
          elevation={0} 
          sx={{ 
            p: isMobile ? 2 : isTablet ? 3 : 4,
            borderRadius: 2,
            bgcolor: 'background.paper'
          }}
        >
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            gutterBottom
          >
            Bienvenido, {user?.username}
          </Typography>
          <Typography 
            variant={isMobile ? "body2" : "body1"} 
            color="textSecondary"
          >
            Seleccione una opción del menú lateral para comenzar.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Home;