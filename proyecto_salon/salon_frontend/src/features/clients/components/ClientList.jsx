import Table from '../../../components/common/Table';
import EntityListView from '../../../components/layout/EntityListView';
import { getClientColumns } from '../logic/ClientList.logic.jsx';
import '../ClientList.css';

function ClientList({ clients, loading, onEdit, onDelete, onCreate }) {
  const columns = getClientColumns();

  return (
    <EntityListView
      title="Clientes"
      description="Gestion de clientes del salon"
      actionLabel="Nuevo Cliente"
      onCreate={onCreate}
      loading={loading}
    >
        <Table
          columns={columns}
          data={clients}
          onEdit={onEdit}
          onDelete={onDelete}
        />
    </EntityListView>
  );
}

export default ClientList;











