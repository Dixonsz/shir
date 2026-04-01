import { getAppointmentStatusConfig } from '../../utils/appointmentStatus';

function formatTimeRange(start, end) {
  return `${start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString(
    'es-ES',
    { hour: '2-digit', minute: '2-digit' }
  )}`;
}

function CalendarAgendaMobile({ date, events, onSelectEvent }) {
  return (
    <section className="calendar-shell__agenda" aria-label="Agenda del dia">
      <div className="calendar-shell__agenda-day-label">
        {date.toLocaleDateString('es-ES', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
        })}
      </div>

      {events.length === 0 ? (
        <div className="calendar-shell__agenda-empty">
          <h3>Dia libre</h3>
          <p>No hay citas para esta fecha.</p>
        </div>
      ) : (
        <ul className="calendar-shell__agenda-list">
          {events.map((event) => {
            const status = getAppointmentStatusConfig(event.status);
            return (
              <li key={event.id}>
                <button
                  type="button"
                  className="calendar-shell__agenda-card"
                  onClick={() => onSelectEvent(event.resource)}
                >
                  <span
                    className="calendar-shell__agenda-status-dot"
                    style={{ backgroundColor: status.color }}
                    aria-hidden="true"
                  />
                  <div className="calendar-shell__agenda-content">
                    <div className="calendar-shell__agenda-time">{formatTimeRange(event.start, event.end)}</div>
                    <div className="calendar-shell__agenda-client">{event.title}</div>
                    <div className="calendar-shell__agenda-member">{event.memberName}</div>
                  </div>
                  <span className="calendar-shell__agenda-status-pill">{status.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default CalendarAgendaMobile;
