import Table from '../../../components/common/Table';
import EntityListView from '../../../components/layout/EntityListView';
import { getServiceColumns } from '../logic/ServiceList.logic.jsx';
import '../ServiceList.css';

function ServiceList({ services, loading, error, onCreate, onEdit, onDelete }) {
  const columns = getServiceColumns();

  return (
    <EntityListView
      title="Servicios"
      description="Catalogo y configuracion de servicios"
      actionLabel="Nuevo Servicio"
      onCreate={onCreate}
      loading={loading}
      error={error}
    >
        <Table
          columns={columns}
          data={services}
          onEdit={onEdit}
          onDelete={onDelete}
        />
    </EntityListView>
  );
}

export default ServiceList;











