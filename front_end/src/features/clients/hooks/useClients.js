import { useState, useEffect } from 'react';
import { clientsApi } from '../api';

export function useClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientsApi.getAll();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData) => {
    try {
      const newClient = await clientsApi.create(clientData);
      setClients((prev) => [...(Array.isArray(prev) ? prev : []), newClient]);
      return { success: true, data: newClient };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al crear cliente',
      };
    }
  };

  const updateClient = async (id, clientData) => {
    try {
      const updatedClient = await clientsApi.update(id, clientData);
      setClients((prev) =>
        Array.isArray(prev)
          ? prev.map((client) =>
              client.id === id ? updatedClient : client
            )
          : []
      );
      return { success: true, data: updatedClient };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al actualizar cliente',
      };
    }
  };

  const deleteClient = async (id) => {
    try {
      await clientsApi.delete(id);
      setClients((prev) =>
        Array.isArray(prev) ? prev.filter((client) => client.id !== id) : []
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al eliminar cliente',
      };
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
  };
}







