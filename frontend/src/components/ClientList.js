import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClients } from "../contexts/ClientsContext";
import { useAuth } from "../contexts/AuthContext";
import {
  Container,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ClientList = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { clients, loading, filters, setFilters, loadClients, removeClient } =
    useClients();
  const [deleteId, setDeleteId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (userId) loadClients();
    // eslint-disable-next-line
  }, [userId]);

  const handleSearch = () => {
    loadClients();
  };

  const handleDelete = async () => {
    try {
      await removeClient(deleteId);
      setSnackbar({
        open: true,
        message: "Cliente eliminado correctamente",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al eliminar cliente",
        severity: "error",
      });
    }
    setDeleteId(null);
  };

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
        mb={2}
      >
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/home")}>
          Regresar
        </Button>
        <Typography variant="h5">Consulta de Clientes</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/cliente/nuevo")}
        >
          Agregar
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" gap={2}>
          <TextField
            label="Identificación"
            value={filters.identification}
            onChange={(e) =>
              setFilters({ ...filters, identification: e.target.value })
            }
          />
          <TextField
            label="Nombre"
            value={filters.nombre}
            onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
          >
            Buscar
          </Button>
        </Box>
      </Paper>

      <Paper>
        <Table>
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
              <TableRow>
                <TableCell colSpan={4}>Cargando...</TableCell>
              </TableRow>
            ) : clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>No hay clientes</TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.identification}</TableCell>
                  <TableCell>{client.nombre}</TableCell>
                  <TableCell>{client.apellidos}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => navigate(`/cliente/detalle/${client.id}`)}
                      color="info"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => navigate(`/cliente/editar/${client.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => setDeleteId(client.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>¿Está seguro de eliminar este cliente?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ClientList;
