import { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { APPOINTMENT_STATUS_CONFIG, getAppointmentStatusConfig } from '../utils/appointmentStatus';
import { getCalendarSettings, isDateBlocked, isDateTimeBlocked } from '../../../core/calendar/calendarSettings';
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
  const backgroundColor = getAppointmentStatusConfig(event.status).color;

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

const blockedDayStyleGetter = (date, settings) => {
  if (!isDateBlocked(date, settings)) {
    return {};
  }

  return {
    style: {
      backgroundColor: 'rgba(239, 68, 68, 0.12)',
      opacity: 0.75,
    },
  };
};

const blockedSlotStyleGetter = (date, settings) => {
  if (!isDateTimeBlocked(date, settings)) {
    return {};
  }

  return {
    style: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      opacity: 0.7,
      cursor: 'not-allowed',
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
  const calendarSettings = getCalendarSettings();

  const parseTime = (time, fallbackHour, fallbackMinute) => {
    if (!time || typeof time !== 'string') {
      return { hour: fallbackHour, minute: fallbackMinute };
    }

    const [hour, minute] = time.split(':').map(Number);
    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      return { hour: fallbackHour, minute: fallbackMinute };
    }

    return { hour, minute };
  };

  const startTime = parseTime(calendarSettings.businessHours?.start, 9, 0);
  const endTime = parseTime(calendarSettings.businessHours?.end, 18, 30);
  const minTime = new Date(1970, 0, 1, startTime.hour, startTime.minute, 0);
  const maxTime = new Date(1970, 0, 1, endTime.hour, endTime.minute, 0);

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
        memberName: member ? `${member.first_name} ${member.last_name}` : 'Sin asignar',
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
          {Object.entries(APPOINTMENT_STATUS_CONFIG).map(([status, config]) => (
            <div className="legend-item" key={status}>
              <span className="legend-color" style={{ backgroundColor: config.color }}></span>
              <span>{config.label}</span>
            </div>
          ))}
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
        dayPropGetter={(dateValue) => blockedDayStyleGetter(dateValue, calendarSettings)}
        slotPropGetter={(dateValue) => blockedSlotStyleGetter(dateValue, calendarSettings)}
        views={['month', 'week', 'day']}
        step={30}
        showMultiDayTimes
        defaultDate={new Date()}
        min={minTime}
        max={maxTime}
        tooltipAccessor={(event) => {
          return `${event.title} - ${event.memberName}\nEstado: ${getAppointmentStatusConfig(event.status).label}`;
        }}
      />
    </div>
  );
}

export default CalendarView;











