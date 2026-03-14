import { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../CalendarView.css';

const locales = {
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const eventStyleGetter = (event) => {
  let backgroundColor = '#3174ad';
  
  switch (event.status) {
    case 'scheduled':
      backgroundColor = '#ffe600'; // azul
      break;
    case 'confirmed':
      backgroundColor = '#10b981'; // verde
      break;
    case 'completed':
      backgroundColor = '#6366f1'; // índigo
      break;
    case 'cancelled':
      backgroundColor = '#ef4444'; // rojo
      break;
    default:
      backgroundColor = '#6b7280'; // gris
  }

  return {
    style: {
      backgroundColor,
      borderRadius: '4px',
      opacity: 0.9,
      color: 'white',
      border: 'none',
      display: 'block',
      fontSize: '0.75rem',
      fontWeight: '500',
      padding: '3px 6px',
    },
  };
};

const messages = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Cita',
  noEventsInRange: 'No hay citas en este rango.',
  showMore: (total) => `+ Ver más (${total})`,
};

function CalendarView({ appointments, clients, members, onSelectEvent, onSelectSlot }) {
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  const events = useMemo(() => {
    return appointments.map((appointment) => {
      const client = clients.find((c) => c.id === appointment.client_id);
      const member = members.find((m) => m.id === appointment.member_id);
      const scheduledDate = new Date(appointment.scheduled_date);

      return {
        id: appointment.id,
        title: client ? `${client.name}` : 'Cliente desconocido',
        start: scheduledDate,
        end: new Date(scheduledDate.getTime() + 60 * 60 * 1000), 
        resource: appointment,
        status: appointment.status,
        memberName: member ? `${member.name} ${member.last_name}` : 'Sin asignar',
      };
    });
  }, [appointments, clients, members]);

  const handleSelectEvent = (event) => {
    if (onSelectEvent) {
      onSelectEvent(event.resource);
    }
  };

  const handleSelectSlot = (slotInfo) => {
    if (onSelectSlot) {
      onSelectSlot(slotInfo);
    }
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-legend">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#ffe600' }}></span>
            <span>Programada</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#10b981' }}></span>
            <span>Confirmada</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#6366f1' }}></span>
            <span>Completada</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#ef4444' }}></span>
            <span>Cancelada</span>
          </div>
        </div>
      </div>
      
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', flex: 1 }}
        messages={messages}
        culture="es"
        view={view}
        onView={handleViewChange}
        date={date}
        onNavigate={handleNavigate}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        eventPropGetter={eventStyleGetter}
        views={['month', 'week', 'day']}
        step={30}
        showMultiDayTimes
        defaultDate={new Date()}
        min={new Date(1970, 0, 1, 9, 0, 0)}
        max={new Date(1970, 0, 1, 18, 30, 0)}
        tooltipAccessor={(event) => {
          return `${event.title} - ${event.memberName}\nEstado: ${event.status}`;
        }}
      />
    </div>
  );
}

export default CalendarView;











