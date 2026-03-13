import { useState, useEffect } from 'react';
import { additionalsApi } from './additionals.api';

export function useAdditionals() {
  const [additionals, setAdditionals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdditionals = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await additionalsApi.getAll();
      setAdditionals(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar adicionales');
    } finally {
      setLoading(false);
    }
  };

  const createAdditional = async (additionalData) => {
    try {
      const newAdditional = await additionalsApi.create(additionalData);
      setAdditionals((prev) => [...(Array.isArray(prev) ? prev : []), newAdditional]);
      return { success: true, data: newAdditional };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al crear adicional',
      };
    }
  };

  const updateAdditional = async (id, additionalData) => {
    try {
      const updatedAdditional = await additionalsApi.update(id, additionalData);
      setAdditionals((prev) =>
        Array.isArray(prev)
          ? prev.map((additional) =>
              additional.id === id ? updatedAdditional : additional
            )
          : []
      );
      return { success: true, data: updatedAdditional };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al actualizar adicional',
      };
    }
  };

  const deleteAdditional = async (id) => {
    try {
      await additionalsApi.delete(id);
      setAdditionals((prev) =>
        Array.isArray(prev) ? prev.filter((additional) => additional.id !== id) : []
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al eliminar adicional',
      };
    }
  };

  useEffect(() => {
    fetchAdditionals();
  }, []);

  return {
    additionals,
    loading,
    error,
    fetchAdditionals,
    createAdditional,
    updateAdditional,
    deleteAdditional,
  };
}
