import React from 'react';
import { Container, Typography, Button, Box, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

const NotFound = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh'
      }}
    >
      <Box sx={{ textAlign: 'center', p: isMobile ? 2 : 4 }}>
        <Typography 
          variant={isMobile ? "h2" : "h1"} 
          color="error" 
          sx={{ fontWeight: 'bold', fontSize: isMobile ? '4rem' : '6rem' }}
        >
          404
        </Typography>
        <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
          Página no encontrada
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<HomeIcon />}
          onClick={() => navigate('/home')}
          size={isMobile ? "medium" : "large"}
        >
          Ir al Inicio
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;