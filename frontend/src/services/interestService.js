import api from './api';

// Obtener todos los intereses
export const getInterests = async () => {
  const response = await api.get('/Intereses/Listado');
  return response.data;
};

// Obtener interés por ID
export const getInterestById = async (id) => {
  const response = await api.get(`/Intereses/Obtener/${id}`);
  return response.data;
};

// Crear nuevo interés
export const createInterest = async (interestData) => {
  const response = await api.post('/Intereses/Crear', interestData);
  return response.data;
};

// Actualizar interés
export const updateInterest = async (id, interestData) => {
  const response = await api.put(`/Intereses/Actualizar/${id}`, interestData);
  return response.data;
};

// Eliminar interés
export const deleteInterest = async (id) => {
  const response = await api.delete(`/Intereses/Eliminar/${id}`);
  return response.data;
};