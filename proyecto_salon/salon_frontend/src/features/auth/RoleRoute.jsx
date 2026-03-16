import { Navigate } from 'react-router-dom';
import { usePermissions } from './hooks';

function RoleRoute({ children, resource = 'dashboard', requiresWrite = false }) {
  const { loading, canReadResource, canWriteResource } = usePermissions();

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.spinner}>Cargando...</div>
      </div>
    );
  }

  if (!canReadResource(resource)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiresWrite && !canWriteResource(resource)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '40vh',
  },
  spinner: {
    fontSize: '1.1rem',
    color: '#94a3b8',
  },
};

export default RoleRoute;
