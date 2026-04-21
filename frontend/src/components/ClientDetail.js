import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getClientById } from '../services/clientService';
import {
  Container, Paper, Typography, Box, Button, Grid, Chip, Avatar,
  Divider, CircularProgress, Snackbar, Alert, useMediaQuery, useTheme,
  Card, CardContent
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
import EmailIcon from '@mui/icons-material/Email';

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
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
      setSnackbar({ open: true, message: 'Error al cargar los datos del cliente', severity: 'error' });
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
        <Paper sx={{ p: isMobile ? 2 : 4, textAlign: 'center', mt: isMobile ? 2 : 4 }}>
          <Typography variant={isMobile ? "h6" : "h5"} color="error">Cliente no encontrado</Typography>
          <Button variant="contained" onClick={() => navigate('/clientes')} sx={{ mt: 2 }}>Volver a la lista</Button>
        </Paper>
      </Container>
    );
  }

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
    <Container maxWidth="lg" sx={{ px: isMobile ? 1 : 2, py: isMobile ? 1 : 2 }}>
      <Box mt={2} mb={2}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/clientes')} size={isMobile ? "small" : "medium"}>
          Volver a Clientes
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: isMobile ? 2 : 3 }}>
        {/* Cabecera */}
        <Box display="flex" flexDirection={isMobile ? "column" : "row"} alignItems={isMobile ? "center" : "flex-start"} justifyContent="space-between" mb={3} gap={2}>
          <Box display="flex" flexDirection={isMobile ? "column" : "row"} alignItems="center" gap={2} textAlign={isMobile ? "center" : "left"}>
            {normalizedClient.imagen ? (
              <Avatar src={normalizedClient.imagen} sx={{ width: isMobile ? 80 : 100, height: isMobile ? 80 : 100 }} />
            ) : (
              <Avatar sx={{ width: isMobile ? 80 : 100, height: isMobile ? 80 : 100, bgcolor: 'primary.main' }}>
                <PersonIcon sx={{ fontSize: isMobile ? 40 : 60 }} />
              </Avatar>
            )}
            <Box>
              <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
                {normalizedClient.nombre} {normalizedClient.apellidos}
              </Typography>
              <Chip label={`ID: ${normalizedClient.identificacion}`} color="primary" variant="outlined" size={isMobile ? "small" : "medium"} />
            </Box>
          </Box>
          <Button variant="contained" startIcon={<EditIcon />} onClick={() => navigate(`/cliente/editar/${id}`)} size={isMobile ? "small" : "medium"}>
            Editar Cliente
          </Button>
        </Box>

        <Divider sx={{ my: isMobile ? 2 : 3 }} />

        {/* Información personal */}
        <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom color="primary">
          Información Personal
        </Typography>
        <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: isMobile ? 2 : 4 }}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <BadgeIcon color="action" fontSize={isMobile ? "small" : "medium"} />
              <Box>
                <Typography variant="caption" color="textSecondary">Identificación</Typography>
                <Typography variant="body2">{normalizedClient.identificacion}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <WcIcon color="action" fontSize={isMobile ? "small" : "medium"} />
              <Box>
                <Typography variant="caption" color="textSecondary">Sexo</Typography>
                <Typography variant="body2">{getSexoText(normalizedClient.sexo)}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarTodayIcon color="action" fontSize={isMobile ? "small" : "medium"} />
              <Box>
                <Typography variant="caption" color="textSecondary">Fecha de Nacimiento</Typography>
                <Typography variant="body2">{formatDate(normalizedClient.fnAcimiento)}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarTodayIcon color="action" fontSize={isMobile ? "small" : "medium"} />
              <Box>
                <Typography variant="caption" color="textSecondary">Fecha de Afiliación</Typography>
                <Typography variant="body2">{formatDate(normalizedClient.fAficion)}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Información de contacto */}
        <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom color="primary">
          Información de Contacto
        </Typography>
        <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: isMobile ? 2 : 4 }}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <PhoneIcon color="action" fontSize={isMobile ? "small" : "medium"} />
              <Box>
                <Typography variant="caption" color="textSecondary">Teléfono Celular</Typography>
                <Typography variant="body2">{normalizedClient.telefonoCelular || 'No especificado'}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <PhoneIcon color="action" fontSize={isMobile ? "small" : "medium"} />
              <Box>
                <Typography variant="caption" color="textSecondary">Otro Teléfono</Typography>
                <Typography variant="body2">{normalizedClient.otroTelefono || 'No especificado'}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={1}>
              <LocationOnIcon color="action" fontSize={isMobile ? "small" : "medium"} />
              <Box>
                <Typography variant="caption" color="textSecondary">Dirección</Typography>
                <Typography variant="body2">{normalizedClient.direccion || 'No especificada'}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Intereses */}
        <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom color="primary">
          Intereses
        </Typography>
        <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: isMobile ? 2 : 4 }}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={1}>
              <FavoriteIcon color="action" fontSize={isMobile ? "small" : "medium"} />
              <Box>
                <Typography variant="caption" color="textSecondary">Interés Principal</Typography>
                <Box mt={1}>
                  <Chip icon={<FavoriteIcon />} label={normalizedClient.interesNombre} color="secondary" variant="outlined" size={isMobile ? "small" : "medium"} />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Reseña Personal */}
        <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom color="primary">
          Reseña Personal
        </Typography>
        <Grid container spacing={isMobile ? 2 : 3}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="flex-start" gap={1}>
              <DescriptionIcon color="action" fontSize={isMobile ? "small" : "medium"} />
              <Box flex={1}>
                <Typography variant="caption" color="textSecondary">Reseña del Cliente</Typography>
                <Paper variant="outlined" sx={{ p: isMobile ? 1.5 : 2, mt: 1, bgcolor: '#f5f5f5' }}>
                  <Typography variant="body2">{normalizedClient.resenaPersonal}</Typography>
                </Paper>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ClientDetail;