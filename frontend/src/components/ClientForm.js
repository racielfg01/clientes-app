import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getInterests } from '../services/interestService';
import { getClientById, createClient, updateClient } from '../services/clientService';
import {
  Container, TextField, Button, Typography, Box, Grid, MenuItem, 
  FormControl, InputLabel, Select, Paper, Snackbar, Alert, CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId, token } = useAuth();
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [imagePreview, setImagePreview] = useState('');
  
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    identificacion: '',
    telefonoCelular: '',
    otroTelefono: '',
    direccion: '',
    fnAcimiento: '',
    fAficion: '',
    sexo: 'M',
    resenaPersonal: '',
    imagen: '',
    interesesFK: '',
    usuarioId: userId || ''
  });

 useEffect(() => {
  const loadData = async () => {
    setLoadingData(true);
    try {
      // Cargar intereses
      const interestsData = await getInterests(token);
      setInterests(interestsData);
      
      // Si es edición, cargar datos del cliente
      if (id) {
        const clientData = await getClientById(id, token);
        console.log('Datos del cliente cargados:', clientData);
        
        // Formatear datos correctamente manejando undefined
        const formattedData = {
          nombre: clientData.nombre || '',
          apellidos: clientData.apellidos || '',
          identificacion: clientData.identification || clientData.identificacion || '',
          telefonoCelular: clientData.telefonoCelular || clientData.telefonocelular || '',
          otroTelefono: clientData.otroTelefono || clientData.otrotelefono || '',
          direccion: clientData.direccion || '',
          fnAcimiento: (clientData.fnAcimiento || clientData.fnacimiento || '').split('T')[0] || '',
          fAficion: (clientData.fAficion || clientData.faficion || '').split('T')[0] || '',
          sexo: clientData.sexo || 'M',
          resenaPersonal: clientData.resenaPersonal || clientData.resenapersonal || '',
          imagen: clientData.imagen || '',
          interesesFK: clientData.interesesFK || clientData.interesesfk || '',
          usuarioId: userId || ''
        };
        
        console.log('Datos formateados para el formulario:', formattedData);
        setForm(formattedData);
        
        if (formattedData.imagen) {
          setImagePreview(formattedData.imagen);
        }
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error al cargar los datos: ' + (error.response?.data?.message || error.message), 
        severity: 'error' 
      });
    } finally {
      setLoadingData(false);
    }
  };
  
  if (userId) {
    loadData();
  }
}, [id, userId, token]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({ open: true, message: 'La imagen no debe superar 5MB', severity: 'error' });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setForm({ ...form, imagen: base64String });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const requiredFields = ['nombre', 'apellidos', 'identificacion', 'telefonoCelular', 
                            'direccion', 'fnAcimiento', 'fAficion', 'resenaPersonal', 'interesesFK'];
    
    for (let field of requiredFields) {
      if (!form[field] || form[field].trim() === '') {
        setSnackbar({ open: true, message: `El campo ${field} es obligatorio`, severity: 'error' });
        return false;
      }
    }
    
    if (form.nombre.length > 50) {
      setSnackbar({ open: true, message: 'El nombre no puede exceder 50 caracteres', severity: 'error' });
      return false;
    }
    
    if (form.apellidos.length > 100) {
      setSnackbar({ open: true, message: 'Los apellidos no pueden exceder 100 caracteres', severity: 'error' });
      return false;
    }
    
    if (form.identificacion.length > 20) {
      setSnackbar({ open: true, message: 'La identificación no puede exceder 20 caracteres', severity: 'error' });
      return false;
    }
    
    if (form.resenaPersonal.length > 200) {
      setSnackbar({ open: true, message: 'La reseña no puede exceder 200 caracteres', severity: 'error' });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const submitData = {
        ...form,
        usuarioId: userId
      };
      
      if (id) {
        submitData.id = id;
        await updateClient(submitData, token);
        setSnackbar({ open: true, message: 'Cliente actualizado correctamente', severity: 'success' });
      } else {
        await createClient(submitData, token);
        setSnackbar({ open: true, message: 'Cliente creado correctamente', severity: 'success' });
      }
      
      setTimeout(() => {
        navigate('/clientes');
      }, 2000);
    } catch (error) {
      console.error('Error guardando cliente:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error al guardar: ' + (error.response?.data?.message || error.message), 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box mt={2} mb={2}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/clientes')}>
          Regresar
        </Button>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">
            {id ? 'Editar Cliente' : 'Nuevo Cliente'}
          </Typography>
          {imagePreview && (
            <Box>
              <img src={imagePreview} alt="Preview" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
            </Box>
          )}
        </Box>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Nombre *"
                name="nombre"
                fullWidth
                value={form.nombre}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 50 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Apellidos *"
                name="apellidos"
                fullWidth
                value={form.apellidos}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 100 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Identificación *"
                name="identificacion"
                fullWidth
                value={form.identificacion}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 20 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Teléfono Celular *"
                name="telefonoCelular"
                fullWidth
                value={form.telefonoCelular}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 20 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Otro Teléfono"
                name="otroTelefono"
                fullWidth
                value={form.otroTelefono}
                onChange={handleChange}
                inputProps={{ maxLength: 20 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Dirección *"
                name="direccion"
                fullWidth
                value={form.direccion}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 200 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Fecha de Nacimiento *"
                type="date"
                name="fnAcimiento"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.fnAcimiento}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Fecha de Afiliación *"
                type="date"
                name="fAficion"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.fAficion}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Sexo *</InputLabel>
                <Select
                  name="sexo"
                  value={form.sexo}
                  onChange={handleChange}
                  label="Sexo *"
                >
                  <MenuItem value="M">Masculino</MenuItem>
                  <MenuItem value="F">Femenino</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Intereses *</InputLabel>
                <Select
                  name="interesesFK"
                  value={form.interesesFK}
                  onChange={handleChange}
                  label="Intereses *"
                >
                  {interests.map((interest) => (
                    <MenuItem key={interest.id} value={interest.id}>
                      {interest.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Reseña Personal *"
                name="resenaPersonal"
                multiline
                rows={3}
                fullWidth
                value={form.resenaPersonal}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 200 }}
                helperText={`${form.resenaPersonal.length}/200 caracteres`}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button variant="outlined" component="label">
                {form.imagen ? 'Cambiar Imagen' : 'Subir Imagen (Opcional)'}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
              {imagePreview && (
                <Box mt={1}>
                  <Typography variant="caption">Imagen cargada</Typography>
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mr: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Guardar'}
              </Button>
              <Button variant="outlined" onClick={() => navigate('/clientes')}>
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ClientForm;