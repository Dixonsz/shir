import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, User, UserCircle, Edit, Trash2 } from 'lucide-react';

function AppointmentDetails({ appointment, clients, members, onEdit, onDelete, onClose }) {
  const client = clients.find((c) => c.id === appointment?.client_id);
  const member = members.find((m) => m.id === appointment?.member_id);

  if (!appointment) return null;

  const scheduledDate = new Date(appointment.scheduled_date);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return '#3b82f6';
      case 'confirmed':
        return '#10b981';
      case 'completed':
        return '#6366f1';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'scheduled':
        return 'Programada';
      case 'confirmed':
        return 'Confirmada';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.statusBadge}>
          <div
            style={{
              ...styles.statusDot,
              backgroundColor: getStatusColor(appointment.status),
            }}
          />
          <span style={styles.statusText}>{getStatusLabel(appointment.status)}</span>
        </div>

        <div style={styles.section}>
          <div style={styles.infoRow}>
            <Calendar size={20} style={styles.icon} />
            <div>
              <div style={styles.label}>Fecha</div>
              <div style={styles.value}>
                {format(scheduledDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
              </div>
            </div>
          </div>

          <div style={styles.infoRow}>
            <Clock size={20} style={styles.icon} />
            <div>
              <div style={styles.label}>Hora</div>
              <div style={styles.value}>
                {format(scheduledDate, 'hh:mm a', { locale: es })}
              </div>
            </div>
          </div>

          <div style={styles.infoRow}>
            <User size={20} style={styles.icon} />
            <div>
              <div style={styles.label}>Cliente</div>
              <div style={styles.value}>
                {client ? `${client.name} ${client.last_name || ''}` : 'No asignado'}
              </div>
              {client?.email && (
                <div style={styles.subValue}>{client.email}</div>
              )}
              {client?.phone_number && (
                <div style={styles.subValue}>{client.phone_number}</div>
              )}
            </div>
          </div>

          <div style={styles.infoRow}>
            <UserCircle size={20} style={styles.icon} />
            <div>
              <div style={styles.label}>Profesional</div>
              <div style={styles.value}>
                {member ? `${member.first_name} ${member.last_name || ''}` : 'No asignado'}
              </div>
            </div>
          </div>
        </div>

        {appointment.total_price !== undefined && (
          <div style={styles.totalSection}>
            <div style={styles.totalLabel}>Total</div>
            <div style={styles.totalValue}>
              ₡{appointment.total_price.toLocaleString('es-CR')}
            </div>
          </div>
        )}

        {appointment.services && appointment.services.length > 0 && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Servicios</div>
            {appointment.services.map((service, index) => (
              <div key={index} style={styles.serviceItem}>
                <span style={styles.serviceName}>{service.service_name}</span>
                <span style={styles.servicePrice}>
                  ₡{service.price_applied.toLocaleString('es-CR')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.actions}>
        <button
          style={{ ...styles.button, ...styles.editButton }}
          onClick={onEdit}
        >
          <Edit size={18} />
          Editar
        </button>
        <button
          style={{ ...styles.button, ...styles.deleteButton }}
          onClick={onDelete}
        >
          <Trash2 size={18} />
          Eliminar
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '1.5rem',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    backgroundColor: '#f3f4f6',
    marginBottom: '1.5rem',
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  statusText: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
  },
  section: {
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '0.75rem',
  },
  infoRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.25rem',
  },
  icon: {
    color: '#6b7280',
    flexShrink: 0,
    marginTop: '0.125rem',
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: '0.25rem',
  },
  value: {
    fontSize: '1rem',
    color: '#111827',
    fontWeight: '500',
  },
  subValue: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '0.25rem',
  },
  totalSection: {
    backgroundColor: '#f9fafb',
    padding: '1rem',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  totalLabel: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
  },
  totalValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#111827',
  },
  serviceItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    marginBottom: '0.5rem',
  },
  serviceName: {
    fontSize: '0.875rem',
    color: '#374151',
  },
  servicePrice: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#111827',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    padding: '1.25rem',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  },
  button: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    border: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  editButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    color: 'white',
  },
};

export default AppointmentDetails;
