import { Menu, Search } from 'lucide-react';
import { useTableFilters } from '../../providers/TableFiltersProvider';
import './Navbar.css';

function Navbar({ onMenuClick }) {
  const {
    searchQuery,
    setSearchQuery,
    datePreset,
    setDatePreset,
    sortOrder,
    setSortOrder,
    customFromDate,
    setCustomFromDate,
    customToDate,
    setCustomToDate,
    clearFilters,
  } = useTableFilters();
  
  // const { user, logout } = useAuth(); // Descomentar cuando se active la seguridad

  return (
    <nav className="dashboard-navbar">
      <div className="dashboard-navbar-container">
        <button
          type="button"
          className="dashboard-navbar-menu-button"
          onClick={onMenuClick}
          aria-label="Abrir menu lateral"
        >
          <Menu size={18} />
        </button>

        <div className="dashboard-navbar-search-section">
          <div className="dashboard-navbar-search-container">
            <Search size={20} color="#64748b" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="dashboard-navbar-search-input"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="dashboard-navbar-filters-row">
            <select
              className="dashboard-navbar-select-input"
              value={datePreset}
              onChange={(event) => setDatePreset(event.target.value)}
            >
              <option value="all">Todas las fechas</option>
              <option value="day">Hoy</option>
              <option value="week">Ultima semana</option>
              <option value="month">Ultimo mes</option>
              <option value="latest">Ultimos registros (30 dias)</option>
              <option value="custom">Rango personalizado</option>
            </select>

            <select
              className="dashboard-navbar-select-input"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            >
              <option value="none">Sin orden por fecha</option>
              <option value="desc">Recientes primero</option>
              <option value="asc">Antiguos primero</option>
            </select>

            <button type="button" className="dashboard-navbar-clear-button" onClick={clearFilters}>
              Limpiar
            </button>
          </div>

          {datePreset === 'custom' ? (
            <div className="dashboard-navbar-filters-row">
              <input
                type="date"
                className="dashboard-navbar-date-input"
                value={customFromDate}
                onChange={(event) => setCustomFromDate(event.target.value)}
              />
              <input
                type="date"
                className="dashboard-navbar-date-input"
                value={customToDate}
                onChange={(event) => setCustomToDate(event.target.value)}
              />
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

