import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container, TextField, Button, Checkbox, FormControlLabel, Typography, Box, Alert, Paper
} from '@mui/material';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
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
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>Iniciar Sesión</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Usuario" fullWidth margin="normal" value={username}
            onChange={(e) => setUsername(e.target.value)} required
          />
          <TextField
            label="Contraseña" type="password" fullWidth margin="normal"
            value={password} onChange={(e) => setPassword(e.target.value)} required
          />
          <FormControlLabel
            control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />}
            label="Recuérdame"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>INICIAR SESIÓN</Button>
          <Box textAlign="center" mt={2}>
            <Typography variant="body2">
              ¿No tiene una cuenta? <Link to="/register">Regístrese</Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;