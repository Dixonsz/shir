import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { appointmentsApi } from './api';
import { servicesApi } from '../services/api';
import { membersApi } from '../members/api';
import { clientsApi } from '../clients/api';
import { showToast } from '../../providers/ToastProvider';
import './PublicAppointmentPage.css';

function initialFormState() {
  return {
    number_id: '',
    name: '',
    email: '',
    phone_number: '',
    member_id: '',
    service_id: '',
    scheduled_date: '',
  };
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
  }).format(Number(value) || 0);
}

function normalizeRole(value) {
  if (!value) return '';

  const normalized = String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

  if (normalized === 'employee') return 'estilista';
  return normalized;
}

function memberHasStylistRole(member) {
  const roleNames = Array.isArray(member?.role_names)
    ? member.role_names
    : member?.rol_name
      ? [member.rol_name]
      : [];

  return roleNames.some((roleName) => normalizeRole(roleName) === 'estilista');
}

function getConflict(appointments, memberId, scheduledDate) {
  if (!memberId || !scheduledDate) {
    return null;
  }

  const newStart = new Date(scheduledDate);
  const newEnd = new Date(newStart.getTime() + 60 * 60 * 1000);

  return (
    appointments.find((appointment) => {
      if (appointment.member_id !== Number(memberId)) {
        return false;
      }

      if (appointment.status === 'cancelled' || !appointment.is_active) {
        return false;
      }

      const currentStart = new Date(appointment.scheduled_date);
      const currentEnd = new Date(currentStart.getTime() + 60 * 60 * 1000);
      return newStart < currentEnd && newEnd > currentStart;
    }) || null
  );
}

export default function PublicAppointmentPage() {
  const [formData, setFormData] = useState(initialFormState);
  const [resolvedClientId, setResolvedClientId] = useState(null);
  const [clientLookupStatus, setClientLookupStatus] = useState('idle');
  const [members, setMembers] = useState([]);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPageData = async () => {
      setLoading(true);
      try {
        const [membersData, servicesData, appointmentsData] = await Promise.all([
          membersApi.getAll(),
          servicesApi.getAll(false),
          appointmentsApi.getAll(false, false),
        ]);

        setMembers(
          Array.isArray(membersData)
            ? membersData.filter((member) => member.is_active && memberHasStylistRole(member))
            : []
        );
        setServices(Array.isArray(servicesData) ? servicesData.filter((s) => s.is_active) : []);
        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      } catch (error) {
        console.error('Error loading appointment page:', error);
        showToast.error('No fue posible cargar la informacion de reservas.');
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, []);

  const selectedService = useMemo(
    () => services.find((service) => service.id === Number(formData.service_id)) || null,
    [services, formData.service_id]
  );

  const selectedMember = useMemo(
    () => members.find((member) => member.id === Number(formData.member_id)) || null,
    [members, formData.member_id]
  );

  const conflict = useMemo(
    () => getConflict(appointments, formData.member_id, formData.scheduled_date),
    [appointments, formData.member_id, formData.scheduled_date]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'number_id') {
      setResolvedClientId(null);
      setClientLookupStatus('idle');
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateBusinessHours = () => {
    const selectedDate = new Date(formData.scheduled_date);
    const hours = selectedDate.getHours();
    const minutes = selectedDate.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const minTime = 9 * 60;
    const maxTime = 18 * 60 + 30;
    return totalMinutes >= minTime && totalMinutes <= maxTime;
  };

  const handleLookupClient = async () => {
    const numberId = formData.number_id.trim();
    if (!numberId) {
      showToast.error('Ingresa una cedula para verificar.');
      return;
    }

    setClientLookupStatus('loading');
    try {
      const existingClient = await clientsApi.getByNumberId(numberId);
      setResolvedClientId(existingClient.id);
      setClientLookupStatus('found');
      setFormData((prev) => ({
        ...prev,
        name: existingClient.name || '',
        email: existingClient.email || '',
        phone_number: existingClient.phone_number || '',
      }));
      showToast.success('Cliente encontrado. Datos cargados.');
    } catch (error) {
      if (error?.response?.status === 404) {
        setResolvedClientId(null);
        setClientLookupStatus('new');
        setFormData((prev) => ({
          ...prev,
          name: '',
          email: '',
          phone_number: '',
        }));
        showToast.info('No existe ese cliente. Completa los datos para registrarlo.');
        return;
      }

      setClientLookupStatus('idle');
      showToast.error('No se pudo verificar la cedula.');
    }
  };

  const resolveClientIdForSubmit = async () => {
    if (clientLookupStatus === 'found' && resolvedClientId) {
      return resolvedClientId;
    }

    const createdClient = await clientsApi.create({
      number_id: formData.number_id.trim(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone_number: formData.phone_number.trim(),
    });

    return createdClient.id;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (clientLookupStatus === 'idle' || clientLookupStatus === 'loading') {
      showToast.error('Primero debes verificar la cedula del cliente.');
      return;
    }

    if (clientLookupStatus === 'new') {
      const hasMissingData =
        !formData.name.trim() || !formData.email.trim() || !formData.phone_number.trim();
      if (hasMissingData) {
        showToast.error('Completa los datos del cliente para registrarlo.');
        return;
      }
    }

    if (!validateBusinessHours()) {
      showToast.error('La cita debe estar entre 9:00 AM y 6:30 PM.');
      return;
    }

    if (conflict) {
      showToast.error('Ese miembro ya tiene una cita en ese horario.');
      return;
    }

    setSaving(true);
    try {
      const clientId = await resolveClientIdForSubmit();

      await appointmentsApi.create({
        client_id: clientId,
        member_id: Number(formData.member_id),
        scheduled_date: new Date(formData.scheduled_date).toISOString(),
        status: 'scheduled',
        is_active: true,
        services: [
          {
            service_id: Number(formData.service_id),
            price_applied: Number(selectedService?.price || 0),
          },
        ],
        products: [],
        additionals: [],
      });

      showToast.success('Tu cita fue registrada con exito.');
      setFormData(initialFormState());
  setResolvedClientId(null);
  setClientLookupStatus('idle');

      const refreshedAppointments = await appointmentsApi.getAll(false, false);
      setAppointments(Array.isArray(refreshedAppointments) ? refreshedAppointments : []);
    } catch (error) {
      console.error('Error creating public appointment:', error);
      showToast.error(error?.response?.data?.message || 'No se pudo registrar tu cita.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="public-appointment-page">
      <div className="public-appointment-shell">
        <header className="public-appointment-header">
          <p className="public-appointment-kicker">Reserva en linea</p>
          <h1>Agenda tu cita</h1>
          
          <Link to="/" className="public-appointment-back-link">
            Regresar
          </Link>
        </header>

        <form className="public-appointment-form" onSubmit={handleSubmit}>
          <div className="public-appointment-grid">
            <div className="public-appointment-grid-full public-appointment-lookup">
              <label>
                Cedula
                <div className="public-appointment-lookup-row">
                  <input
                    type="text"
                    name="number_id"
                    value={formData.number_id}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="public-appointment-lookup-button"
                    onClick={handleLookupClient}
                    disabled={clientLookupStatus === 'loading'}
                  >
                    {clientLookupStatus === 'loading' ? 'Verificando...' : 'Verificar'}
                  </button>
                </div>
              </label>

              {clientLookupStatus === 'found' ? (
                <p className="public-appointment-lookup-found">
                  Cliente existente detectado. Se usaran sus datos registrados.
                </p>
              ) : null}

              {clientLookupStatus === 'new' ? (
                <p className="public-appointment-lookup-new">
                  Cliente nuevo. Completa nombre, correo y telefono para registrarlo.
                </p>
              ) : null}
            </div>

            <label>
              Nombre completo
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                readOnly={clientLookupStatus === 'found'}
                required
              />
            </label>

            <label>
              Correo electronico
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                readOnly={clientLookupStatus === 'found'}
                required
              />
            </label>

            <label>
              Telefono
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                readOnly={clientLookupStatus === 'found'}
                required
              />
            </label>

            <label>
              Servicio
              <select
                name="service_id"
                value={formData.service_id}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Selecciona un servicio</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {formatCurrency(service.price)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Especialista
              <select
                name="member_id"
                value={formData.member_id}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Selecciona un especialista</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.full_name || `${member.first_name} ${member.last_name}`}
                  </option>
                ))}
              </select>
            </label>

            <label className="public-appointment-grid-full">
              Fecha y hora
              <input
                type="datetime-local"
                name="scheduled_date"
                value={formData.scheduled_date}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <aside className="public-appointment-summary">
            <h2>Resumen</h2>
            <p>
              Servicio: <strong>{selectedService?.name || 'Sin seleccionar'}</strong>
            </p>
            <p>
              Especialista:{' '}
              <strong>
                {selectedMember
                  ? selectedMember.full_name || `${selectedMember.first_name} ${selectedMember.last_name}`
                  : 'Sin seleccionar'}
              </strong>
            </p>
            <p>
              Desde : <strong>{formatCurrency(selectedService?.price)}</strong>
            </p>
            {conflict ? (
              <p className="public-appointment-warning">
                El horario seleccionado no esta disponible para ese especialista.
              </p>
            ) : null}
            <button type="submit" disabled={saving || loading || Boolean(conflict)}>
              {saving ? 'Reservando...' : 'Confirmar reserva'}
            </button>
          </aside>
        </form>
      </div>
    </section>
  );
}
