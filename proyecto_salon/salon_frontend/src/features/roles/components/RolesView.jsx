import Table from '../../../components/common/Table';
import EntityListView from '../../../components/layout/EntityListView';
import { CheckCircle2, XCircle } from 'lucide-react';

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

  return (
    <EntityListView
      title="Roles"
      description="Gestión de roles del sistema"
      actionLabel="Nuevo Rol"
      onCreate={onCreate}
      loading={loading}
      error={error}
    >
        <Table
          columns={columns}
          data={roles}
          onEdit={onEdit}
          onDelete={onDelete}
        />
    </EntityListView>
  );
}

export default RolesView;











