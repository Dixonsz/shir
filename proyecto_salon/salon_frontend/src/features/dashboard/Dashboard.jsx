import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointments } from '../appointments/hooks';
import CalendarView from '../appointments/components/CalendarView';
import AppointmentDetails from './AppointmentDetails';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const { appointments, clients, members, loading, error, deleteAppointment } = useAppointments();
  const { confirm } = useConfirm();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleSelectEvent = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetails(true);
  };

  const handleSelectSlot = (slotInfo) => {
    navigate('/dashboard/appointments', {
      state: {
        initialDate: slotInfo.start,
        fromCalendar: true,
      },
    });
  };

  const handleCreateNew = () => {
    navigate('/dashboard/appointments', {
      state: { fromCalendar: true },
    });
  };

  const handleEdit = () => {
    if (!selectedAppointment) return;
    navigate('/dashboard/appointments', {
      state: {
        appointment: selectedAppointment,
        editMode: true,
      },
    });
  };

  const handleDelete = async () => {
    if (!selectedAppointment) return;
    const confirmed = await confirm(
      '¿Está seguro de eliminar esta cita?',
      'Esta acción no se puede deshacer.'
    );
    if (!confirmed) return;

    const result = await deleteAppointment(selectedAppointment.id);
    if (result.success) {
      showToast.success('Cita eliminada exitosamente');
      setShowDetails(false);
      setSelectedAppointment(null);
    } else {
      showToast.error(result.error);
    }
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedAppointment(null);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <p>Cargando calendario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard - Gestion de Citas</h1>
        <button className="btn btn-primary" onClick={handleCreateNew}>
          + Nueva Cita
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-main">
          <CalendarView
            appointments={appointments}
            clients={clients}
            members={members}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
          />
        </div>

        {showDetails && selectedAppointment && (
          <div className="dashboard-sidebar">
            <div className="sidebar-content">
              <div className="sidebar-panel">
                <div className="sidebar-header">
                  <h3>Detalles de la Cita</h3>
                  <button className="btn-close" onClick={handleCloseDetails}>
                    ×
                  </button>
                </div>
                <AppointmentDetails
                  appointment={selectedAppointment}
                  clients={clients}
                  members={members}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onClose={handleCloseDetails}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;





