import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Container, TextField, Button, Typography, Box, Alert, Paper,
  useMediaQuery, useTheme 
} from '@mui/material';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/;
    return regex.test(pwd);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      setError('Todos los campos son obligatorios');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Correo electrónico inválido');
      return;
    }
    if (!validatePassword(form.password)) {
      setError('La contraseña debe tener 8-20 caracteres, una mayúscula, una minúscula y un número');
      return;
    }
    const result = await register(form.username, form.email, form.password);
    if (result.success) {
      setSuccess('Usuario creado correctamente. Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 2000);
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
        <Typography variant={isMobile ? "h6" : "h5"} align="center" gutterBottom>
          Registro
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2, fontSize: isMobile ? '0.875rem' : '1rem' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2, fontSize: isMobile ? '0.875rem' : '1rem' }}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField 
            name="username" 
            label="Usuario" 
            fullWidth 
            margin="normal" 
            size={isMobile ? "small" : "medium"}
            value={form.username} 
            onChange={handleChange} 
            required 
          />
          <TextField 
            name="email" 
            label="Correo electrónico" 
            type="email" 
            fullWidth 
            margin="normal" 
            size={isMobile ? "small" : "medium"}
            value={form.email} 
            onChange={handleChange} 
            required 
          />
          <TextField 
            name="password" 
            label="Contraseña" 
            type="password" 
            fullWidth 
            margin="normal" 
            size={isMobile ? "small" : "medium"}
            value={form.password} 
            onChange={handleChange} 
            required 
          />
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ mt: 2, py: isMobile ? 1 : 1.5 }}
            size={isMobile ? "medium" : "large"}
          >
            REGISTRARSE
          </Button>
          <Box textAlign="center" mt={2}>
            <Typography variant={isMobile ? "caption" : "body2"}>
              <Link to="/login">¿Ya tiene cuenta? Inicie sesión</Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;