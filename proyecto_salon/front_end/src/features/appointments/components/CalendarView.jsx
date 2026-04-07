import { useMemo, useState } from 'react';
import { dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { addDays, addMonths, addWeeks, subDays, subMonths, subWeeks } from 'date-fns';
import { getCalendarSettings } from '../../../core/calendar/calendarSettings';
import { useIsMobile } from '../../../hooks/useIsMobile';
import CalendarHeader from './calendar/CalendarHeader';
import CalendarDesktop from './calendar/CalendarDesktop';
import CalendarAgendaMobile from './calendar/CalendarAgendaMobile';
import { buildCalendarEvents, getBusinessHoursRange, getDayEvents, normalizeDate } from './calendar/calendarUtils';
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

function CalendarView({ appointments, clients, members, onSelectEvent, onSelectSlot }) {
  const isMobile = useIsMobile(900);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('all');
  const calendarSettings = getCalendarSettings();

  const { minTime, maxTime } = useMemo(
    () => getBusinessHoursRange(calendarSettings),
    [calendarSettings]
  );

  const events = useMemo(() => {
    return buildCalendarEvents(appointments, clients, members, statusFilter);
  }, [appointments, clients, members, statusFilter]);

  const mobileDayEvents = useMemo(() => getDayEvents(events, normalizeDate(date)), [events, date]);

  const goToPrev = () => {
    if (isMobile) {
      setDate((current) => subDays(current, 1));
      return;
    }

    if (view === 'month') {
      setDate((current) => subMonths(current, 1));
      return;
    }

    if (view === 'week') {
      setDate((current) => subWeeks(current, 1));
      return;
    }

    setDate((current) => subDays(current, 1));
  };

  const goToNext = () => {
    if (isMobile) {
      setDate((current) => addDays(current, 1));
      return;
    }

    if (view === 'month') {
      setDate((current) => addMonths(current, 1));
      return;
    }

    if (view === 'week') {
      setDate((current) => addWeeks(current, 1));
      return;
    }

    setDate((current) => addDays(current, 1));
  };

  const goToToday = () => {
    setDate(new Date());
    if (isMobile) return;
    if (view === 'day') return;
    setView('day');
  };

  return (
    <section className="calendar-shell">
      <CalendarHeader
        isMobile={isMobile}
        view={view}
        date={date}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onViewChange={setView}
        onPrev={goToPrev}
        onNext={goToNext}
        onToday={goToToday}
      />

      {isMobile ? (
        <CalendarAgendaMobile date={date} events={mobileDayEvents} onSelectEvent={onSelectEvent} />
      ) : (
        <CalendarDesktop
          localizer={localizer}
          events={events}
          view={view}
          date={date}
          onViewChange={setView}
          onDateChange={setDate}
          onSelectEvent={onSelectEvent}
          onSelectSlot={onSelectSlot}
          minTime={minTime}
          maxTime={maxTime}
          calendarSettings={calendarSettings}
        />
      )}
    </section>
  );
}

export default CalendarView;