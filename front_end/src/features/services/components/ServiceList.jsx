import Table from '../../../components/common/Table';
import EntityListView from '../../../components/layout/EntityListView';
import { getServiceColumns } from '../logic/ServiceList.logic.jsx';
import { usePermissions } from '../../auth/hooks';
import '../ServiceList.css';

function ServiceList({ services, loading, error, onCreate, onEdit, onDelete, pagination, isMutating = false }) {
  const { canWriteResource } = usePermissions();
  const canWrite = canWriteResource('services');
  const columns = getServiceColumns();

  return (
    <EntityListView
      title="Servicios"
      description="Catalogo y configuracion de servicios"
      actionLabel="Nuevo Servicio"
      onCreate={canWrite ? onCreate : undefined}
      actionDisabled={isMutating}
      actionLoading={isMutating}
      loading={loading}
      error={error}
    >
        <Table
          columns={columns}
          data={services}
          onEdit={canWrite && !isMutating ? onEdit : undefined}
          onDelete={canWrite && !isMutating ? onDelete : undefined}
          {...pagination}
        />
    </EntityListView>
  );
}

export default ServiceList;











