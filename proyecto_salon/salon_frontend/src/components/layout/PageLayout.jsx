import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function PageLayout() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={{
        ...styles.content,
        marginLeft: isDashboard ? 0 : '288px',
      }}>
        <Navbar />
        <main style={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    backgroundColor: '#0f172a',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: '100vh',
  },
  main: {
    flex: 1,
    padding: '2.5rem',
    backgroundColor: '#0f172a',
    overflow: 'auto',
    color: '#e2e8f0',
  },
};

export default PageLayout;
