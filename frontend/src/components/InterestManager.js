import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Box, Button, Table, TableHead, TableRow,
  TableCell, TableBody, IconButton, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, Snackbar, Alert, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import {
  getInterests,
  createInterest,
  updateInterest,
  deleteInterest
} from '../services/interestService';

const InterestManager = () => {
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
      setSnackbar({
        open: true,
        message: 'Error al cargar los intereses',
        severity: 'error'
      });
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
      setSnackbar({
        open: true,
        message: 'El nombre del interés es obligatorio',
        severity: 'error'
      });
      return;
    }

    try {
      if (editingInterest) {
        await updateInterest(editingInterest.id, { nombre: interestName });
        setSnackbar({
          open: true,
          message: 'Interés actualizado correctamente',
          severity: 'success'
        });
      } else {
        await createInterest({ nombre: interestName });
        setSnackbar({
          open: true,
          message: 'Interés creado correctamente',
          severity: 'success'
        });
      }
      handleCloseDialog();
      loadInterests();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al guardar el interés',
        severity: 'error'
      });
    }
  };

  const handleDeleteInterest = async () => {
    if (!deleteConfirm) return;

    try {
      await deleteInterest(deleteConfirm.id);
      setSnackbar({
        open: true,
        message: 'Interés eliminado correctamente',
        severity: 'success'
      });
      setDeleteConfirm(null);
      loadInterests();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al eliminar el interés. Puede que esté siendo usado por algún cliente.',
        severity: 'error'
      });
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={2} mb={2}>
        <Button variant="outlined" onClick={() => window.history.back()}>
          Volver
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">
            Gestión de Intereses
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nuevo Interés
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre del Interés</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {interests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No hay intereses registrados
                  </TableCell>
                </TableRow>
              ) : (
                interests.map((interest) => (
                  <TableRow key={interest.id}>
                    <TableCell>{interest.nombre}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(interest)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => setDeleteConfirm(interest)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Diálogo para crear/editar interés */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingInterest ? 'Editar Interés' : 'Nuevo Interés'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre del Interés"
            type="text"
            fullWidth
            variant="outlined"
            value={interestName}
            onChange={(e) => setInterestName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveInterest} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de eliminar el interés "{deleteConfirm?.nombre}"?
            {deleteConfirm && (
              <Typography variant="caption" display="block" color="warning.main" mt={1}>
                Nota: Si hay clientes asociados a este interés, no podrá eliminarse.
              </Typography>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
          <Button onClick={handleDeleteInterest} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

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

export default InterestManager;