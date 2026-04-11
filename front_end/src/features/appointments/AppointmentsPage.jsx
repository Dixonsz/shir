import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppointments } from './hooks';
import AppointmentList from './components/AppointmentList';
import AppointmentFormV2 from './AppointmentFormV2';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';
import { usePagination } from '../../hooks/usePagination';
import { useMutationLock } from '../../hooks/useMutationLock';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../utils/constants';
import { appointmentsApi } from './api';

function AppointmentsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    clients,
    members,
    loading,
    fetchClients,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  } = useAppointments({ skipAppointmentsFetch: true });
  const { confirm } = useConfirm();
  const [view, setView] = useState('list');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [initialDate, setInitialDate] = useState(null);
  const [fromCalendar, setFromCalendar] = useState(false);
  const [editingLoading, setEditingLoading] = useState(false);
  const { isLocked: isMutating, runWithLock } = useMutationLock();

  const getAppointmentId = (appointment) => appointment?.id ?? appointment?.md;

  const loadAppointmentForEdit = useCallback(async (appointment) => {
    const appointmentId = getAppointmentId(appointment);
    if (!appointmentId) return appointment;

    const hasDetails =
      Array.isArray(appointment?.services) ||
      Array.isArray(appointment?.appointment_services) ||
      Array.isArray(appointment?.additionals);

    if (hasDetails) return appointment;

    try {
      return await appointmentsApi.getById(appointmentId, true, true);
    } catch (error) {
      console.error('Error cargando detalle de cita:', error);
      showToast.error('No se pudo cargar el detalle completo de la cita');
      return appointment;
    }
  }, []);

  const fetchAppointmentsPage = useCallback(({ page, pageSize }) => {
    return appointmentsApi.getAll(false, true, { page, pageSize });
  }, []);

  const {
    data: appointments,
    page,
    pages,
    total,
    pageSize,
    loading: paginationLoading,
    setPage,
    setPageSize,
    refresh,
  } = usePagination(fetchAppointmentsPage, { pageSize: DEFAULT_PAGE_SIZE });

  useEffect(() => {
    if (location.state) {
      if (location.state.fromCalendar || location.state.editMode) {
        const openFormFromState = async () => {
          setFromCalendar(true);

          if (location.state.appointment) {
            setEditingLoading(true);
            const detailedAppointment = await loadAppointmentForEdit(location.state.appointment);
            setSelectedAppointment(detailedAppointment);
            setEditingLoading(false);
          }

          if (location.state.initialDate) {
            setInitialDate(location.state.initialDate);
          }

          setView('form');
          window.history.replaceState({}, document.title);
        };

        openFormFromState();
      }
    }
  }, [location.state, loadAppointmentForEdit]);

  const handleCreate = () => {
    if (isMutating) return;
    setSelectedAppointment(null);
    setInitialDate(null);
    setView('form');
  };

  const handleEdit = async (appointment) => {
    if (isMutating) return;
    setEditingLoading(true);
    const detailedAppointment = await loadAppointmentForEdit(appointment);
    setSelectedAppointment(detailedAppointment);
    setEditingLoading(false);
    setInitialDate(null);
    setView('form');
  };

  const handleClientCreated = () => {
    fetchClients(); 
  };

  const handleDelete = async (appointment) => {
    await runWithLock(async () => {
      const confirmed = await confirm(
        `¿Está seguro de eliminar esta cita?`,
        { title: 'Esta acción no se puede deshacer.' }
      );

      if (confirmed) {
        const appointmentId = appointment.id ?? appointment.md;
        const result = await deleteAppointment(appointmentId);
        if (result.success) {
          await refresh();
          showToast.success('Cita eliminada exitosamente');
        } else {
          showToast.error(result.error);
        }
      }
    });
  };

  const handlesubmit = async (formData) => {
    const selectedId = selectedAppointment?.id ?? selectedAppointment?.md;
    await runWithLock(async () => {
      const result = selectedAppointment
        ? await updateAppointment(selectedId, formData)
        : await createAppointment(formData);

      if (result.success) {
        await refresh();
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
    });
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
    if (editingLoading) {
      return <p>Cargando detalle de la cita...</p>;
    }

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
      loading={loading || paginationLoading}
      isMutating={isMutating}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCreate={handleCreate}
      pagination={{
        page,
        pages,
        total,
        pageSize,
        onPageChange: setPage,
        onPageSizeChange: setPageSize,
        pageSizeOptions: PAGE_SIZE_OPTIONS,
      }}
    />
  );
}

export default AppointmentsPage;





