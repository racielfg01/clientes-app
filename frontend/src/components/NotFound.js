import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Container sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h1" color="error">404</Typography>
      <Typography variant="h5">Página no encontrada</Typography>
      <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/home')}>Ir al Inicio</Button>
    </Container>
  );
};

export default NotFound;