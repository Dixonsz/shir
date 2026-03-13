import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import { Plus, CheckCircle2, XCircle } from 'lucide-react';

function RolesView({
  roles,
  loading,
  error,
  onCreate,
  onEdit,
  onDelete,
}) {

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
    {
      key: 'is_active',
      label: 'Estado',
      render: (value) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {value ? (
            <CheckCircle2 size={22} color="#10b981" strokeWidth={2.5} />
          ) : (
            <XCircle size={22} color="#ef4444" strokeWidth={2.5} />
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return <div style={styles.message}>Cargando roles...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Gestión de Roles</h1>
        <Button onClick={onCreate} variant="primary">
          <Plus size={20} />
          Nuevo Rol
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={roles}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </Card>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#e2e8f0',
    margin: 0,
  },
  message: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.1rem',
    color: '#94a3b8',
  },
  error: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.1rem',
    color: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
};

export default RolesView;
