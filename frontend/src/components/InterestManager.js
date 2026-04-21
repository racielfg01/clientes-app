import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Box, Button, Table, TableHead, TableRow,
  TableCell, TableBody, IconButton, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, Snackbar, Alert, CircularProgress,
  useMediaQuery, useTheme, Card, CardContent, CardActions, Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  getInterests,
  createInterest,
  updateInterest,
  deleteInterest
} from '../services/interestService';

const InterestManager = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingInterest, setEditingInterest] = useState(null);
  const [interestName, setInterestName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadInterests();
  }, []);

  const loadInterests = async () => {
    setLoading(true);
    try {
      const data = await getInterests();
      setInterests(data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al cargar los intereses', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (interest = null) => {
    if (interest) {
      setEditingInterest(interest);
      setInterestName(interest.nombre);
    } else {
      setEditingInterest(null);
      setInterestName('');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingInterest(null);
    setInterestName('');
  };

  const handleSaveInterest = async () => {
    if (!interestName.trim()) {
      setSnackbar({ open: true, message: 'El nombre del interés es obligatorio', severity: 'error' });
      return;
    }
    try {
      if (editingInterest) {
        await updateInterest(editingInterest.id, { nombre: interestName });
        setSnackbar({ open: true, message: 'Interés actualizado correctamente', severity: 'success' });
      } else {
        await createInterest({ nombre: interestName });
        setSnackbar({ open: true, message: 'Interés creado correctamente', severity: 'success' });
      }
      handleCloseDialog();
      loadInterests();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al guardar el interés', severity: 'error' });
    }
  };

  const handleDeleteInterest = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteInterest(deleteConfirm.id);
      setSnackbar({ open: true, message: 'Interés eliminado correctamente', severity: 'success' });
      setDeleteConfirm(null);
      loadInterests();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al eliminar el interés. Puede que esté siendo usado por algún cliente.', severity: 'error' });
    }
  };

  return (
    <Container maxWidth="md" sx={{ px: isMobile ? 1 : 2, py: isMobile ? 1 : 2 }}>
      <Box mt={2} mb={2}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => window.history.back()} size={isMobile ? "small" : "medium"}>
          Volver
        </Button>
      </Box>

      <Paper sx={{ p: isMobile ? 2 : 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Typography variant={isMobile ? "h6" : "h5"}>Gestión de Intereses</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} size={isMobile ? "small" : "medium"}>
            Nuevo Interés
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
        ) : isMobile ? (
          // Vista de tarjetas para móvil
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {interests.length === 0 ? (
              <Typography align="center">No hay intereses registrados</Typography>
            ) : (
              interests.map((interest) => (
                <Card key={interest.id}>
                  <CardContent>
                    <Typography variant="body1" fontWeight="medium">{interest.nombre}</Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton onClick={() => handleOpenDialog(interest)} color="primary" size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => setDeleteConfirm(interest)} color="error" size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              ))
            )}
          </Box>
        ) : (
          // Tabla para tablet y desktop
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre del Interés</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {interests.length === 0 ? (
                <TableRow><TableCell colSpan={2} align="center">No hay intereses registrados</TableCell></TableRow>
              ) : (
                interests.map((interest) => (
                  <TableRow key={interest.id}>
                    <TableCell>{interest.nombre}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenDialog(interest)} color="primary" size="small"><EditIcon fontSize="small" /></IconButton>
                      <IconButton onClick={() => setDeleteConfirm(interest)} color="error" size="small"><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Diálogos */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{editingInterest ? 'Editar Interés' : 'Nuevo Interés'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Nombre del Interés" type="text" fullWidth variant="outlined" value={interestName} onChange={(e) => setInterestName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveInterest} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Está seguro de eliminar el interés "{deleteConfirm?.nombre}"?</Typography>
          <Typography variant="caption" display="block" color="warning.main" mt={1}>
            Nota: Si hay clientes asociados a este interés, no podrá eliminarse.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
          <Button onClick={handleDeleteInterest} color="error" variant="contained">Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default InterestManager;