import { Link } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
// import { useAuth } from '../../features/auth/useAuth';

function Navbar() {
  const user = { name: 'Usuario Demo' };
  const logout = () => console.log('Logout desactivado');
  
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
            />
          </div>
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
    maxWidth: '500px',
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
