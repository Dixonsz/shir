import { Search } from 'lucide-react';
import { useTableFilters } from '../../providers/TableFiltersProvider';
// import { useAuth } from '../../features/auth/useAuth';

function Navbar() {
  const user = { name: 'Usuario Demo' };
  const logout = () => console.log('Logout desactivado');
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
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.searchSection}>
          <div style={styles.searchContainer}>
            <Search size={20} color="#64748b" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              style={styles.searchInput}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div style={styles.filtersRow}>
            <select
              style={styles.selectInput}
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
              style={styles.selectInput}
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            >
              <option value="none">Sin orden por fecha</option>
              <option value="desc">Recientes primero</option>
              <option value="asc">Antiguos primero</option>
            </select>

            <button type="button" style={styles.clearButton} onClick={clearFilters}>
              Limpiar
            </button>
          </div>

          {datePreset === 'custom' ? (
            <div style={styles.filtersRow}>
              <input
                type="date"
                style={styles.dateInput}
                value={customFromDate}
                onChange={(event) => setCustomFromDate(event.target.value)}
              />
              <input
                type="date"
                style={styles.dateInput}
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

const styles = {
  navbar: {
    backgroundColor: '#1e293b',
    borderBottom: '1px solid rgba(71, 85, 105, 0.5)',
    padding: '1rem 2.5rem',
    position: 'sticky',
    top: 0,
    zIndex: 40,
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchSection: {
    flex: 1,
    maxWidth: '980px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: '1px solid rgba(71, 85, 105, 0.3)',
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#e2e8f0',
    fontSize: '14px',
  },
  filtersRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  selectInput: {
    minWidth: '220px',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    border: '1px solid rgba(71, 85, 105, 0.4)',
    borderRadius: '10px',
    color: '#e2e8f0',
    fontSize: '13px',
    padding: '0.55rem 0.7rem',
    outline: 'none',
  },
  dateInput: {
    minWidth: '180px',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    border: '1px solid rgba(71, 85, 105, 0.4)',
    borderRadius: '10px',
    color: '#e2e8f0',
    fontSize: '13px',
    padding: '0.55rem 0.7rem',
    outline: 'none',
  },
  clearButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(239, 68, 68, 0.45)',
    borderRadius: '10px',
    color: '#fda4af',
    fontSize: '13px',
    fontWeight: 600,
    padding: '0.55rem 0.85rem',
    cursor: 'pointer',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  iconButton: {
    position: 'relative',
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  badge: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    backgroundColor: '#ee2b8c',
    color: '#fff',
    fontSize: '10px',
    fontWeight: '700',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #1e293b',
  },
};

export default Navbar;

