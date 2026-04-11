import Table from '../../../components/common/Table';
import EntityListView from '../../../components/layout/EntityListView';
import { getCategoryServiceColumns } from '../logic/CategoryServiceList.logic.jsx';
import { usePermissions } from '../../auth/hooks';
import '../CategoryServiceList.css';

function CategoryServiceList({ categories, loading, error, onCreate, onEdit, onDelete, pagination, isMutating = false }) {
  const { canWriteResource } = usePermissions();
  const canWrite = canWriteResource('category_services');
  const columns = getCategoryServiceColumns();

  return (
    <EntityListView
      title="Categorías de Servicios"
      description="Gestión de categorías para el catálogo de servicios"
      actionLabel="Nueva Categoría"
      onCreate={canWrite ? onCreate : undefined}
      actionDisabled={isMutating}
      actionLoading={isMutating}
      loading={loading}
      error={error}
    >
        <Table
          columns={columns}
          data={categories}
          onEdit={canWrite && !isMutating ? onEdit : undefined}
          onDelete={canWrite && !isMutating ? onDelete : undefined}
          {...pagination}
        />
    </EntityListView>
  );
}

export default CategoryServiceList;











