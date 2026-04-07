import { useState, useEffect } from 'react';
import { rolesApi } from '../api';

export function useRoles() {
  const [roles, setRoles] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoles = async () => {
    setloading(true);
    setError(null);
    try {
      const data = await rolesApi.getAll();
      setRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar roles');
    } finally {
      setloading(false);
    }
  };

  const createRole = async (roleData) => {
    try {
      const newRole = await rolesApi.create(roleData);
      setRoles((prev) => [...(Array.isArray(prev) ? prev : []), newRole]);
      return { success: true, data: newRole };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al crear rol',
      };
    }
  };

  const updateRole = async (id, roleData) => {
    try {
      const updatedRole = await rolesApi.update(id, roleData);
      setRoles((prev) =>
        Array.isArray(prev)
          ? prev.map((role) => ((role.id === id || role.md === id) ? updatedRole : role))
          : []
      );
      return { success: true, data: updatedRole };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al actualmzar rol',
      };
    }
  };

  const deleteRole = async (id) => {
    try {
      await rolesApi.delete(id);
      setRoles((prev) =>
        Array.isArray(prev) ? prev.filter((role) => role.id !== id && role.md !== id) : []
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al elmmmnar rol',
      };
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    loading,
    error,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
  };
}







