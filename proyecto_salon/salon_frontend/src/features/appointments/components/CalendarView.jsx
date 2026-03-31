import { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { APPOINTMENT_STATUS_CONFIG, getAppointmentStatusConfig } from '../utils/appointmentStatus';
import { getCalendarSettings, isDateBlocked, isDateTimeBlocked } from '../../../core/calendar/calendarSettings';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../CalendarLedger.css';

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const eventStyleGetter = (event) => ({
  style: {
    backgroundColor: getAppointmentStatusConfig(event.status).color,
    borderRadius: '4px',
    opacity: 0.9,
    color: 'white',
    border: 'none',
    fontSize: '0.75rem',
    fontWeight: '500',
    padding: '3px 6px',
  },
});

const blockedDayStyleGetter = (date, settings) =>
  isDateBlocked(date, settings)
    ? { style: { backgroundColor: 'rgba(239, 68, 68, 0.12)', opacity: 0.75 } }
    : {};

const blockedSlotStyleGetter = (date, settings) =>
  isDateTimeBlocked(date, settings)
    ? {
        style: {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          opacity: 0.7,
          cursor: 'not-allowed',
        },
      }
    : {};

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
  const [statusFilter, setStatusFilter] = useState('all');
  const calendarSettings = getCalendarSettings();

  const parseTime = (time, h, m) => {
    if (!time) return { hour: h, minute: m };
    const [hour, minute] = time.split(':').map(Number);
    return Number.isNaN(hour) ? { hour: h, minute: m } : { hour, minute };
  };

  const startTime = parseTime(calendarSettings.businessHours?.start, 9, 0);
  const endTime = parseTime(calendarSettings.businessHours?.end, 18, 30);

  const minTime = new Date(1970, 0, 1, startTime.hour, startTime.minute);
  const maxTime = new Date(1970, 0, 1, endTime.hour, endTime.minute);

  const events = useMemo(() => {
    return appointments
      .filter(a => statusFilter === 'all' || a.status === statusFilter)
      .map(a => {
        const client = clients.find(c => c.id === a.client_id);
        const member = members.find(m => m.id === a.member_id);
        const d = new Date(a.scheduled_date);

        return {
          id: a.id,
          title: client ? client.name : 'Cliente desconocido',
          start: d,
          end: new Date(d.getTime() + 60 * 60 * 1000),
          resource: a,
          status: a.status,
          memberName: member
            ? `${member.first_name} ${member.last_name}`
            : 'Sin asignar',
        };
      });
  }, [appointments, clients, members, statusFilter]);

  return (
    <div className="calendar-ledger-container">
      {/* Header */}
      <div className="calendar-ledger-header">
        <span className="calendar-ledger-label">Agenda</span>

        <div className="calendar-ledger-title-row" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
          {/* Botones de navegación de mes */}
          <div className="calendar-ledger-nav-btns">
            <button
              className="calendar-ledger-nav-btn"
              type="button"
              aria-label="Mes anterior"
              onClick={() => {
                if (view === 'month') {
                  const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
                  setDate(prevMonth);
                } else if (view === 'week') {
                  const prevWeek = new Date(date);
                  prevWeek.setDate(date.getDate() - 7);
                  setDate(prevWeek);
                } else if (view === 'day') {
                  const prevDay = new Date(date);
                  prevDay.setDate(date.getDate() - 1);
                  setDate(prevDay);
                }
              }}
            >
              &#8592;
            </button>
          </div>
          <h2 className="calendar-ledger-title" style={{ flex: 1, textAlign: 'center' }}>
            {view === 'month'
              ? date.toLocaleString('es-ES', { month: 'long', year: 'numeric' })
              : view === 'week'
              ? `Semana del ${date.toLocaleDateString('es-ES')}`
              : date.toLocaleDateString('es-ES')}
          </h2>
          <div className="calendar-ledger-nav-btns">
            <button
              className="calendar-ledger-nav-btn"
              type="button"
              aria-label="Mes siguiente"
              onClick={() => {
                if (view === 'month') {
                  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
                  setDate(nextMonth);
                } else if (view === 'week') {
                  const nextWeek = new Date(date);
                  nextWeek.setDate(date.getDate() + 7);
                  setDate(nextWeek);
                } else if (view === 'day') {
                  const nextDay = new Date(date);
                  nextDay.setDate(date.getDate() + 1);
                  setDate(nextDay);
                }
              }}
            >
              &#8594;
            </button>
          </div>

          {/* FILTRO */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="calendar-ledger-status-filter"
          >
            <option value="all">Todos</option>
            {Object.entries(APPOINTMENT_STATUS_CONFIG).map(([s, c]) => (
              <option key={s} value={s}>{c.label}</option>
            ))}
          </select>

          {/* BOTONES DE VISTA UNIFICADOS */}
          <div className="calendar-ledger-view-btns">
            <button
              onClick={() => setView('month')}
              className={`calendar-ledger-view-btn${view === 'month' ? ' active' : ''}`}
              type="button"
            >
              Mes
            </button>
            <button
              onClick={() => setView('week')}
              className={`calendar-ledger-view-btn${view === 'week' ? ' active' : ''}`}
              type="button"
            >
              Semana
            </button>
            <button
              onClick={() => {
                setView('day');
                setDate(new Date());
              }}
              className={`calendar-ledger-view-btn${view === 'day' ? ' active' : ''}`}
              type="button"
            >
              Hoy
            </button>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div style={{ height: '600px', marginTop: '1rem' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          messages={messages}
          culture="es"
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          selectable
          onSelectSlot={onSelectSlot}
          eventPropGetter={eventStyleGetter}
          dayPropGetter={(d) => blockedDayStyleGetter(d, calendarSettings)}
          slotPropGetter={(d) => blockedSlotStyleGetter(d, calendarSettings)}
          views={['month', 'week', 'day']}
          min={minTime}
          max={maxTime}
          toolbar={false}
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
}

export default CalendarView;