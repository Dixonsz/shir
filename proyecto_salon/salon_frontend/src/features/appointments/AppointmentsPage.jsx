import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppointments } from './hooks';
import AppointmentList from './components/AppointmentList';
import AppointmentFormV2 from './AppointmentFormV2';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';

function AppointmentsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    appointments,
    clients,
    members,
    loading,
    fetchClients,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  } = useAppointments();
  const { confirm } = useConfirm();
  const [view, setView] = useState('list');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [initialDate, setInitialDate] = useState(null);
  const [fromCalendar, setFromCalendar] = useState(false);

  useEffect(() => {
    if (location.state) {
      if (location.state.fromCalendar || location.state.editMode) {
        setFromCalendar(true);
        
        if (location.state.appointment) {
          setSelectedAppointment(location.state.appointment);
        }
        
        if (location.state.initialDate) {
          setInitialDate(location.state.initialDate);
        }
        
        setView('form');
        
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state]);

  const handleCreate = () => {
    setSelectedAppointment(null);
    setInitialDate(null);
    setView('form');
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setInitialDate(null);
    setView('form');
  };

  const handleClientCreated = () => {
    fetchClients(); 
  };

  const handleDelete = async (appointment) => {
    const confirmed = await confirm(
      `¿Está seguro de eliminar esta cita?`,
      { title: 'Esta acción no se puede deshacer.' }
    );

    if (confirmed) {
      const appointmentId = appointment.id ?? appointment.md;
      const result = await deleteAppointment(appointmentId);
      if (result.success) {
        showToast.success('Cita eliminada exitosamente');
      } else {
        showToast.error(result.error);
      }
    }
  };

  const handlesubmit = async (formData) => {
    const selectedId = selectedAppointment?.id ?? selectedAppointment?.md;
    const result = selectedAppointment
      ? await updateAppointment(selectedId, formData)
      : await createAppointment(formData);

    if (result.success) {
      showToast.success(
        selectedAppointment
          ? 'Cita actualizada exitosamente'
          : 'Cita creada exitosamente'
      );
      
      if (fromCalendar) {
        navigate('/dashboard');
      } else {
        setView('list');
      }
    } else {
      showToast.error(result.error);
    }
  };

  const handleCancel = () => {
    setSelectedAppointment(null);
    setInitialDate(null);
    
    if (fromCalendar) {
      setFromCalendar(false);
      navigate('/dashboard');
    } else {
      setView('list');
    }
  };

  if (view === 'form') {
    return (
      <AppointmentFormV2
        appointment={selectedAppointment}
        clients={clients}
        members={members}
        appointments={appointments}
        onSubmit={handlesubmit}
        onCancel={handleCancel}
        onClientCreated={handleClientCreated}
        initialDate={initialDate}
      />
    );
  }

  return (
    <AppointmentList
      appointments={appointments}
      clients={clients}
      members={members}
      loading={loading}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCreate={handleCreate}
    />
  );
}

export default AppointmentsPage;





