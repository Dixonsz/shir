import "./Schedule.css";

export default function Schedule() {
  return (
    <div className="schedule-section">
      <div className="schedule-container">
        <h3 className="schedule-title">
          <span className="schedule-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </span>
          Horario de AtenciÃ³n
        </h3>
        <div className="schedule-list">
          <div className="schedule-item">
            <span className="schedule-days">Lunes - Viernes</span>
            <span className="schedule-hours">09:00 AM - 06:30 PM</span>
          </div>
          <div className="schedule-item">
            <span className="schedule-days">SÃ¡bado</span>
            <span className="schedule-hours">09:00 AM - 06:30 PM</span>
          </div>
          <div className="schedule-item schedule-item-closed">
            <span className="schedule-days">Domingo</span>
            <span className="schedule-hours">Cerrado</span>
          </div>
        </div>
      </div>
    </div>
  );
}

