import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClients } from "../contexts/ClientsContext";
import { useAuth } from "../contexts/AuthContext";
import {
  Container, TextField, Button, Table, TableHead, TableRow,
  TableCell, TableBody, IconButton, Paper, Typography, Box,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar,
  Alert, useMediaQuery, useTheme, Card, CardContent, CardActions,
  Chip, Grid, InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ClearIcon from "@mui/icons-material/Clear";

const ClientList = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const { clients, loading, filters, setFilters, loadClients, removeClient } = useClients();
  const [deleteId, setDeleteId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (userId) loadClients();
  }, [userId]);

  const handleSearch = () => loadClients();
  const handleClearFilters = () => {
    setFilters({ identification: '', nombre: '' });
    setTimeout(() => loadClients(), 100);
  };

  const handleDelete = async () => {
    try {
      await removeClient(deleteId);
      setSnackbar({ open: true, message: "Cliente eliminado correctamente", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Error al eliminar cliente", severity: "error" });
    }
    setDeleteId(null);
  };

  return (
    <Container maxWidth="xl" sx={{ px: isMobile ? 1 : 2, py: isMobile ? 1 : 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1} mb={2}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/home")} size={isMobile ? "small" : "medium"}>
          Regresar
        </Button>
        <Typography variant={isMobile ? "h6" : "h5"} component="h1">
          Consulta de Clientes
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/cliente/nuevo")} size={isMobile ? "small" : "medium"}>
          Agregar
        </Button>
      </Box>

      <Paper sx={{ p: isMobile ? 1.5 : 2, mb: 2 }}>
        <Grid container spacing={isMobile ? 1 : 2} alignItems="center">
          <Grid item xs={12} sm={5} md={4}>
            <TextField
              label="Identificación"
              value={filters.identification}
              onChange={(e) => setFilters({ ...filters, identification: e.target.value })}
              size={isMobile ? "small" : "medium"}
              fullWidth
              InputProps={{
                endAdornment: filters.identification && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setFilters({ ...filters, identification: '' })}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={5} md={4}>
            <TextField
              label="Nombre"
              value={filters.nombre}
              onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
              size={isMobile ? "small" : "medium"}
              fullWidth
              InputProps={{
                endAdornment: filters.nombre && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setFilters({ ...filters, nombre: '' })}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2} md={4}>
            <Box display="flex" gap={1}>
              <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch} fullWidth size={isMobile ? "small" : "medium"}>
                Buscar
              </Button>
              {(filters.identification || filters.nombre) && (
                <Button variant="outlined" onClick={handleClearFilters} size={isMobile ? "small" : "medium"}>
                  Limpiar
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {isMobile ? (
        // Vista de tarjetas para móvil
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {loading ? (
            <Typography align="center">Cargando...</Typography>
          ) : clients.length === 0 ? (
            <Typography align="center">No hay clientes</Typography>
          ) : (
            clients.map((client) => (
              <Card key={client.id} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {client.nombre} {client.apellidos}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ID: {client.identification}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', gap: 1, pb: 1, pr: 2 }}>
                  <IconButton onClick={() => navigate(`/cliente/detalle/${client.id}`)} color="info" size="small">
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => navigate(`/cliente/editar/${client.id}`)} color="primary" size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => setDeleteId(client.id)} color="error" size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            ))
          )}
        </Box>
      ) : (
        // Tabla para tablet y desktop
        <Paper sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: isTablet ? 500 : 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Identificación</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellidos</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} align="center">Cargando...</TableCell></TableRow>
              ) : clients.length === 0 ? (
                <TableRow><TableCell colSpan={4} align="center">No hay clientes</TableCell></TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.identification}</TableCell>
                    <TableCell>{client.nombre}</TableCell>
                    <TableCell>{client.apellidos}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => navigate(`/cliente/detalle/${client.id}`)} color="info" size="small">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => navigate(`/cliente/editar/${client.id}`)} color="primary" size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => setDeleteId(client.id)} color="error" size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>¿Está seguro de eliminar este cliente?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ClientList;