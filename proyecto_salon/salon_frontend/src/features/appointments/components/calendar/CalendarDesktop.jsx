import { Calendar } from 'react-big-calendar';
import { getAppointmentStatusConfig } from '../../utils/appointmentStatus';
import { isDateBlocked, isDateTimeBlocked } from '../../../../core/calendar/calendarSettings';

const eventStyleGetter = (event) => ({
  style: {
    backgroundColor: getAppointmentStatusConfig(event.status).color,
    borderRadius: '10px',
    opacity: 0.95,
    color: '#ffffff',
    border: 'none',
    fontSize: '0.77rem',
    fontWeight: '600',
    padding: '4px 7px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
  },
});

const blockedDayStyleGetter = (date, settings) =>
  isDateBlocked(date, settings)
    ? { style: { backgroundColor: 'rgba(217, 119, 6, 0.12)', opacity: 0.82 } }
    : {};

const blockedSlotStyleGetter = (date, settings) =>
  isDateTimeBlocked(date, settings)
    ? {
        style: {
          backgroundColor: 'rgba(217, 119, 6, 0.08)',
          opacity: 0.8,
          cursor: 'not-allowed',
        },
      }
    : {};

const messages = {
  allDay: 'Todo el dia',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Dia',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Cita',
  noEventsInRange: 'No hay citas en este rango.',
  showMore: (total) => `+ Ver mas (${total})`,
};

function CalendarDesktop({
  localizer,
  events,
  view,
  date,
  onViewChange,
  onDateChange,
  onSelectEvent,
  onSelectSlot,
  minTime,
  maxTime,
  calendarSettings,
}) {
  return (
    <div className="calendar-shell__desktop" aria-label="Calendario de escritorio">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        messages={messages}
        culture="es"
        view={view}
        onView={onViewChange}
        date={date}
        onNavigate={onDateChange}
        selectable
        onSelectEvent={(event) => onSelectEvent(event.resource)}
        onSelectSlot={onSelectSlot}
        eventPropGetter={eventStyleGetter}
        dayPropGetter={(currentDate) => blockedDayStyleGetter(currentDate, calendarSettings)}
        slotPropGetter={(slotDate) => blockedSlotStyleGetter(slotDate, calendarSettings)}
        views={['month', 'week', 'day']}
        min={minTime}
        max={maxTime}
        toolbar={false}
        style={{ height: '100%' }}
      />
    </div>
  );
}

export default CalendarDesktop;
