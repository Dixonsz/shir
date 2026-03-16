import Table from '../../../components/common/Table';
import EntityListView from '../../../components/layout/EntityListView';
import { getServiceColumns } from '../logic/ServiceList.logic.jsx';
import { usePermissions } from '../../auth/hooks';
import '../ServiceList.css';

function ServiceList({ services, loading, error, onCreate, onEdit, onDelete }) {
  const { canWriteResource } = usePermissions();
  const canWrite = canWriteResource('services');
  const columns = getServiceColumns();

  return (
    <EntityListView
      title="Servicios"
      description="Catalogo y configuracion de servicios"
      actionLabel="Nuevo Servicio"
      onCreate={canWrite ? onCreate : undefined}
      loading={loading}
      error={error}
    >
        <Table
          columns={columns}
          data={services}
          onEdit={canWrite ? onEdit : undefined}
          onDelete={canWrite ? onDelete : undefined}
        />
    </EntityListView>
  );
}

export default ServiceList;











