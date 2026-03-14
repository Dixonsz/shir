import { useState, useEffect } from 'react';
import { appointmentsApi } from '../api';
import { clientsApi } from '../../clients/api';
import { membersApi } from '../../members/api';

export function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentsApi.getAll();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar citas');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const data = await clientsApi.getAll();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar clientes:', err);
    }
  };

  const fetchMembers = async () => {
    try {
      const data = await membersApi.getAll();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar miembros:', err);
    }
  };

  const createAppointment = async (appointmentData) => {
    try {
      const newAppointment = await appointmentsApi.create(appointmentData);
      setAppointments((prev) => [...(Array.isArray(prev) ? prev : []), newAppointment]);
      return { success: true, data: newAppointment };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al crear cita',
      };
    }
  };

  const updateAppointment = async (id, appointmentData) => {
    try {
      const updatedAppointment = await appointmentsApi.update(id, appointmentData);
      setAppointments((prev) =>
        Array.isArray(prev)
          ? prev.map((appointment) =>
              appointment.id === id ? updatedAppointment : appointment
            )
          : []
      );
      return { success: true, data: updatedAppointment };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al actualizar cita',
      };
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await appointmentsApi.delete(id);
      setAppointments((prev) =>
        Array.isArray(prev) ? prev.filter((appointment) => appointment.id !== id) : []
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al eliminar cita',
      };
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchClients();
    fetchMembers();
  }, []);

  return {
    appointments,
    clients,
    members,
    loading,
    error,
    fetchAppointments,
    fetchClients,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };
}







