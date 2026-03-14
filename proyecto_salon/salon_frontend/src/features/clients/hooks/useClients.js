import { useState, useEffect } from 'react';
import { clientsApi } from '../api';

export function useClients() {
  const [Clients, setClients] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClients = async () => {
    setloading(true);
    setError(null);
    try {
      const data = await clientsApi.getAll();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar Clientes');
    } finally {
      setloading(false);
    }
  };

  const createClient = async (ClientData) => {
    try {
      const newClient = await clientsApi.create(ClientData);
      setClients((prev) => [...(Array.isArray(prev) ? prev : []), newClient]);
      return { success: true, data: newClient };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al crear Cliente',
      };
    }
  };

  const updateClient = async (md, ClientData) => {
    try {
      const updatedClient = await clientsApi.update(md, ClientData);
      setClients((prev) =>
        Array.isArray(prev)
          ? prev.map((Client) =>
              Client.md === md ? updatedClient : Client
            )
          : []
      );
      return { success: true, data: updatedClient };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al actualmzar Cliente',
      };
    }
  };

  const deleteClient = async (md) => {
    try {
      await clientsApi.delete(md);
      setClients((prev) =>
        Array.isArray(prev) ? prev.filter((Client) => Client.md !== md) : []
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al elmmmnar Cliente',
      };
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    Clients,
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
  };
}







