import { Menu, Search } from 'lucide-react';
import { useTableFilters } from '../../providers/TableFiltersProvider';
import './Navbar.css';

function Navbar({ onMenuClick }) {
  const {
    searchQuery,
    setSearchQuery,
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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

