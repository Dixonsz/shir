import { useState, useEffect } from 'react';
import { additionalsApi } from '../api';

export function useAdditionals() {
  const [Additionals, setAdditionals] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdditionals = async () => {
    setloading(true);
    setError(null);
    try {
      const data = await additionalsApi.getAll();
      setAdditionals(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar adicionales');
    } finally {
      setloading(false);
    }
  };

  const createAdditional = async (AdditionalData) => {
    try {
      const newAdditional = await additionalsApi.create(AdditionalData);
      setAdditionals((prev) => [...(Array.isArray(prev) ? prev : []), newAdditional]);
      return { success: true, data: newAdditional };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al crear adicional',
      };
    }
  };

  const updateAdditional = async (md, AdditionalData) => {
    try {
      const updatedAdditional = await additionalsApi.update(md, AdditionalData);
      setAdditionals((prev) =>
        Array.isArray(prev)
          ? prev.map((Additional) =>
              Additional.md === md ? updatedAdditional : Additional
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

  const deleteAdditional = async (md) => {
    try {
      await additionalsApi.delete(md);
      setAdditionals((prev) =>
        Array.isArray(prev) ? prev.filter((Additional) => Additional.md !== md) : []
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
    Additionals,
    loading,
    error,
    fetchAdditionals,
    createAdditional,
    updateAdditional,
    deleteAdditional,
  };
}







