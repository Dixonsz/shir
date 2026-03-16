import Table from '../../../components/common/Table';
import EntityListView from '../../../components/layout/EntityListView';
import { getClientColumns } from '../logic/ClientList.logic.jsx';
import { usePermissions } from '../../auth/hooks';
import '../ClientList.css';

function ClientList({ clients, loading, onEdit, onDelete, onCreate }) {
  const { canWriteResource } = usePermissions();
  const canWrite = canWriteResource('clients');
  const columns = getClientColumns();

  return (
    <EntityListView
      title="Clientes"
      description="Gestion de clientes del salon"
      actionLabel="Nuevo Cliente"
      onCreate={canWrite ? onCreate : undefined}
      loading={loading}
    >
        <Table
          columns={columns}
          data={clients}
          onEdit={canWrite ? onEdit : undefined}
          onDelete={canWrite ? onDelete : undefined}
        />
    </EntityListView>
  );
}

export default ClientList;











