import api from './api';

export const getClients = async (filters) => {
  const response = await api.post('/Cliente/Listado', filters);
  return response.data;
};

export const deleteClient = async (id) => {
  const response = await api.delete(`/Cliente/Eliminar/${id}`);
  return response.data;
};

export const getClientById = async (id) => {
  const response = await api.get(`/Cliente/Obtener/${id}`);
  return response.data;
};

export const createClient = async (clientData) => {
  const response = await api.post('/Cliente/Crear', clientData);
  return response.data;
};

export const updateClient = async (clientData) => {
  const response = await api.post('/Cliente/Actualizar', clientData);
  return response.data;
};