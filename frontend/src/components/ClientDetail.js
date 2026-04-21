import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getClientById } from '../services/clientService';
import {
  Container, Paper, Typography, Box, Button, Grid, Chip, Avatar,
  Divider, CircularProgress, IconButton, Snackbar, Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import WcIcon from '@mui/icons-material/Wc';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DescriptionIcon from '@mui/icons-material/Description';

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadClient();
  }, [id]);

  const loadClient = async () => {
    setLoading(true);
    try {
      const data = await getClientById(id, token);
      console.log('Cliente cargado para detalle:', data);
      setClient(data);
    } catch (error) {
      console.error('Error cargando cliente:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar los datos del cliente',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'No especificada';
    }
  };

  const getSexoText = (sexo) => {
    return sexo === 'M' ? 'Masculino' : sexo === 'F' ? 'Femenino' : 'No especificado';
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!client) {
    return (
      <Container>
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <Typography variant="h5" color="error">
            Cliente no encontrado
          </Typography>
          <Button variant="contained" onClick={() => navigate('/clientes')} sx={{ mt: 2 }}>
            Volver a la lista
          </Button>
        </Paper>
      </Container>
    );
  }

  // Normalizar nombres de campos (por si vienen en diferentes formatos)
  const normalizedClient = {
    id: client.id,
    nombre: client.nombre || '',
    apellidos: client.apellidos || '',
    identificacion: client.identification || client.identificacion || '',
    telefonoCelular: client.telefonoCelular || client.telefonocelular || '',
    otroTelefono: client.otroTelefono || client.otrotelefono || '',
    direccion: client.direccion || '',
    fnAcimiento: client.fnAcimiento || client.fnacimiento || '',
    fAficion: client.fAficion || client.faficion || '',
    sexo: client.sexo || 'M',
    resenaPersonal: client.resenaPersonal || client.resenapersonal || 'No hay reseña disponible',
    imagen: client.imagen || '',
    interesesFK: client.interesesFK || client.interesesfk || '',
    interesNombre: client.interesNombre || client.interesnombre || client.nombre_interes || 'No especificado'
  };

  return (
    <Container maxWidth="lg">
      <Box mt={2} mb={2}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/clientes')}>
          Volver a Clientes
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Cabecera con foto y nombre */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
          <Box display="flex" alignItems="center" gap={2}>
            {normalizedClient.imagen ? (
              <Avatar
                src={normalizedClient.imagen}
                sx={{ width: 100, height: 100 }}
              />
            ) : (
              <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}>
                <PersonIcon sx={{ fontSize: 60 }} />
              </Avatar>
            )}
            <Box>
              <Typography variant="h4" gutterBottom>
                {normalizedClient.nombre} {normalizedClient.apellidos}
              </Typography>
              <Chip
                label={`ID: ${normalizedClient.identificacion}`}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/cliente/editar/${id}`)}
          >
            Editar Cliente
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Información personal */}
        <Typography variant="h6" gutterBottom color="primary">
          Información Personal
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <BadgeIcon color="action" />
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Identificación
                </Typography>
                <Typography variant="body1">
                  {normalizedClient.identificacion}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <WcIcon color="action" />
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Sexo
                </Typography>
                <Typography variant="body1">
                  {getSexoText(normalizedClient.sexo)}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarTodayIcon color="action" />
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Fecha de Nacimiento
                </Typography>
                <Typography variant="body1">
                  {formatDate(normalizedClient.fnAcimiento)}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarTodayIcon color="action" />
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Fecha de Afiliación
                </Typography>
                <Typography variant="body1">
                  {formatDate(normalizedClient.fAficion)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Información de contacto */}
        <Typography variant="h6" gutterBottom color="primary">
          Información de Contacto
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <PhoneIcon color="action" />
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Teléfono Celular
                </Typography>
                <Typography variant="body1">
                  {normalizedClient.telefonoCelular || 'No especificado'}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <PhoneIcon color="action" />
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Otro Teléfono
                </Typography>
                <Typography variant="body1">
                  {normalizedClient.otroTelefono || 'No especificado'}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={1}>
              <LocationOnIcon color="action" />
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Dirección
                </Typography>
                <Typography variant="body1">
                  {normalizedClient.direccion || 'No especificada'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Intereses */}
        <Typography variant="h6" gutterBottom color="primary">
          Intereses
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={1}>
              <FavoriteIcon color="action" />
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Interés Principal
                </Typography>
                <Box mt={1}>
                  <Chip
                    icon={<FavoriteIcon />}
                    label={normalizedClient.interesNombre}
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Reseña Personal */}
        <Typography variant="h6" gutterBottom color="primary">
          Reseña Personal
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="flex-start" gap={1}>
              <DescriptionIcon color="action" />
              <Box flex={1}>
                <Typography variant="caption" color="textSecondary">
                  Reseña del Cliente
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: '#f5f5f5' }}>
                  <Typography variant="body1">
                    {normalizedClient.resenaPersonal}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ClientDetail;