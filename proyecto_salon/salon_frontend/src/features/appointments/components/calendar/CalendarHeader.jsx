import { APPOINTMENT_STATUS_CONFIG } from '../../utils/appointmentStatus';

function getHeaderTitle(date, isMobile, view) {
  if (isMobile) {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  if (view === 'month') {
    return date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  }

  if (view === 'week') {
    return `Semana del ${date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}`;
  }

  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
}

function CalendarHeader({
  isMobile,
  view,
  date,
  statusFilter,
  onStatusFilterChange,
  onViewChange,
  onPrev,
  onNext,
  onToday,
}) {
  return (
    <header className="calendar-shell__header">
      <div className="calendar-shell__eyebrow">Agenda</div>

      <div className="calendar-shell__controls">
        <div className="calendar-shell__nav-group" role="group" aria-label="Navegacion de fechas">
          <button className="calendar-shell__nav-btn" type="button" onClick={onPrev} aria-label="Periodo anterior">
            &#8592;
          </button>
          <button className="calendar-shell__today-btn" type="button" onClick={onToday}>
            Hoy
          </button>
          <button className="calendar-shell__nav-btn" type="button" onClick={onNext} aria-label="Periodo siguiente">
            &#8594;
          </button>
        </div>

        <h2 className="calendar-shell__title">{getHeaderTitle(date, isMobile, view)}</h2>

        <div className="calendar-shell__toolbar-right">
          <select
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value)}
            className="calendar-shell__status-filter"
            aria-label="Filtrar por estado"
          >
            <option value="all">Todos los estados</option>
            {Object.entries(APPOINTMENT_STATUS_CONFIG).map(([status, config]) => (
              <option key={status} value={status}>
                {config.label}
              </option>
            ))}
          </select>

          {!isMobile ? (
            <div className="calendar-shell__view-switch" role="group" aria-label="Cambiar vista">
              <button
                type="button"
                onClick={() => onViewChange('month')}
                className={`calendar-shell__view-btn${view === 'month' ? ' is-active' : ''}`}
              >
                Mes
              </button>
              <button
                type="button"
                onClick={() => onViewChange('week')}
                className={`calendar-shell__view-btn${view === 'week' ? ' is-active' : ''}`}
              >
                Semana
              </button>
              <button
                type="button"
                onClick={() => onViewChange('day')}
                className={`calendar-shell__view-btn${view === 'day' ? ' is-active' : ''}`}
              >
                Dia
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default CalendarHeader;
