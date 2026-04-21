import React, { createContext, useContext, useState } from 'react';
import { getClients, deleteClient } from '../services/clientService';
import { useAuth } from './AuthContext';

const ClientsContext = createContext();

export const useClients = () => useContext(ClientsContext);

export const ClientsProvider = ({ children }) => {
  const { userId } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ identification: '', nombre: '' });

  const loadClients = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getClients({ ...filters, usuarioId: userId });
      setClients(data);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeClient = async (id) => {
    await deleteClient(id);
    await loadClients(); // recargar lista
  };

  return (
    <ClientsContext.Provider value={{ clients, loading, filters, setFilters, loadClients, removeClient }}>
      {children}
    </ClientsContext.Provider>
  );
};