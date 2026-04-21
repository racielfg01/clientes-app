import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container, TextField, Button, Checkbox, FormControlLabel, 
  Typography, Box, Alert, Paper, useMediaQuery, useTheme
} from '@mui/material';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const remembered = localStorage.getItem('rememberedUser');
    if (remembered) {
      setUsername(remembered);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Usuario y contraseña son obligatorios');
      return;
    }
    const result = await login(username, password, remember);
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.message);
    }
  };

  return (
    <Container 
      maxWidth="xs" 
      sx={{ 
        px: isMobile ? 2 : 3,
        py: isMobile ? 4 : 8
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: isMobile ? 3 : 4, 
          mt: isMobile ? 4 : 8,
          borderRadius: isMobile ? 2 : 1
        }}
      >
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          align="center" 
          gutterBottom
        >
          Iniciar Sesión
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2, fontSize: isMobile ? '0.875rem' : '1rem' }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Usuario"
            fullWidth
            margin="normal"
            size={isMobile ? "small" : "medium"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            size={isMobile ? "small" : "medium"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={remember} 
                onChange={(e) => setRemember(e.target.checked)} 
                size={isMobile ? "small" : "medium"}
              />
            }
            label={<Typography variant={isMobile ? "caption" : "body2"}>Recuérdame</Typography>}
          />
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ mt: 2, py: isMobile ? 1 : 1.5 }}
            size={isMobile ? "medium" : "large"}
          >
            INICIAR SESIÓN
          </Button>
          <Box textAlign="center" mt={2}>
            <Typography variant={isMobile ? "caption" : "body2"}>
              ¿No tiene una cuenta? <Link to="/register">Regístrese</Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;