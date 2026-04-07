import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, User, UserCircle, Edit, Trash2 } from 'lucide-react';
import { getAppointmentStatusConfig } from '../appointments/utils/appointmentStatus';
import './AppointmentDetails.css';

function AppointmentDetails({ appointment, clients, members, onEdit, onDelete }) {
  const client = clients.find((c) => c.id === appointment?.client_id);
  const member = members.find((m) => m.id === appointment?.member_id);

  if (!appointment) return null;

  const scheduledDate = new Date(appointment.scheduled_date);
  const statusConfig = getAppointmentStatusConfig(appointment.status);

  return (
    <div className="appointment-details">
      <div className="appointment-details-content">
        <div className="appointment-status-badge">
          <div
            className="appointment-status-dot"
            style={{ backgroundColor: statusConfig.color }}
          />
          <span className="appointment-status-text">{statusConfig.label}</span>
        </div>

        <div className="appointment-section">
          <div className="appointment-info-row">
            <Calendar size={20} className="appointment-info-icon" />
            <div>
              <p className="appointment-info-label">Fecha</p>
              <p className="appointment-info-value">
                {format(scheduledDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
              </p>
            </div>
          </div>

          <div className="appointment-info-row">
            <Clock size={20} className="appointment-info-icon" />
            <div>
              <p className="appointment-info-label">Hora</p>
              <p className="appointment-info-value">
                {format(scheduledDate, 'hh:mm a', { locale: es })}
              </p>
            </div>
          </div>

          <div className="appointment-info-row">
            <User size={20} className="appointment-info-icon" />
            <div>
              <p className="appointment-info-label">Cliente</p>
              <p className="appointment-info-value">
                {client ? `${client.name} ${client.last_name || ''}` : 'No asignado'}
              </p>
              {client?.email && (
                <div className="appointment-info-subvalue">{client.email}</div>
              )}
              {client?.phone_number && (
                <div className="appointment-info-subvalue">{client.phone_number}</div>
              )}
            </div>
          </div>

          <div className="appointment-info-row">
            <UserCircle size={20} className="appointment-info-icon" />
            <div>
              <p className="appointment-info-label">Profesional</p>
              <p className="appointment-info-value">
                {member ? `${member.first_name} ${member.last_name || ''}` : 'No asignado'}
              </p>
            </div>
          </div>
        </div>

        {appointment.total_price !== undefined && (
          <div className="appointment-total">
            <div className="appointment-total-label">Total</div>
            <div className="appointment-total-value">
              ₡{appointment.total_price.toLocaleString('es-CR')}
            </div>
          </div>
        )}

        {appointment.services && appointment.services.length > 0 && (
          <div className="appointment-section">
            <h4 className="appointment-section-title">Servicios</h4>
            {appointment.services.map((service, index) => (
              <div key={index} className="appointment-service-item">
                <span className="appointment-service-name">{service.service_name}</span>
                <span className="appointment-service-price">
                  ₡{service.price_applied.toLocaleString('es-CR')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {(onEdit || onDelete) ? (
        <div className="appointment-actions">
          {onEdit ? (
            <button
              className="appointment-action-button appointment-action-button-edit"
              onClick={onEdit}
              type="button"
            >
              <Edit size={18} />
              Editar
            </button>
          ) : null}
          {onDelete ? (
            <button
              className="appointment-action-button appointment-action-button-delete"
              onClick={onDelete}
              type="button"
            >
              <Trash2 size={18} />
              Eliminar
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default AppointmentDetails;





