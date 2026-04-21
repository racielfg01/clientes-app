import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemText, Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Sistema de Clientes</Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>{user?.username}</Typography>
          <Button color="inherit" onClick={handleLogout}>Cerrar Sesión</Button>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            <ListItem button onClick={() => { navigate('/home'); setDrawerOpen(false); }}>
              <ListItemText primary="INICIO" />
            </ListItem>
            <ListItem button onClick={() => { navigate('/clientes'); setDrawerOpen(false); }}>
              <ListItemText primary="Cuentas Clientes" />
            </ListItem>
            <ListItem button onClick={() => { navigate('/intereses'); setDrawerOpen(false); }}>
  <ListItemText primary="Gestionar Intereses" />
</ListItem>
          </List>
        </Box>
      </Drawer>
      <Box p={3}>
        <Typography variant="h4">Bienvenido, {user?.username}</Typography>
        <Typography variant="body1">Seleccione una opción del menú lateral.</Typography>
      </Box>
    </div>
  );
};

export default Home;