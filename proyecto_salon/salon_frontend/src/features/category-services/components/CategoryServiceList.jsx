import Table from '../../../components/common/Table';
import EntityListView from '../../../components/layout/EntityListView';
import { getCategoryServiceColumns } from '../logic/CategoryServiceList.logic.jsx';
import { usePermissions } from '../../auth/hooks';
import '../CategoryServiceList.css';

function CategoryServiceList({ categories, loading, error, onCreate, onEdit, onDelete }) {
  const { canWriteResource } = usePermissions();
  const canWrite = canWriteResource('category_services');
  const columns = getCategoryServiceColumns();

  return (
    <EntityListView
      title="Categorías de Servicios"
      description="Gestión de categorías para el catálogo de servicios"
      actionLabel="Nueva Categoría"
      onCreate={canWrite ? onCreate : undefined}
      loading={loading}
      error={error}
    >
        <Table
          columns={columns}
          data={categories}
          onEdit={canWrite ? onEdit : undefined}
          onDelete={canWrite ? onDelete : undefined}
        />
    </EntityListView>
  );
}

export default CategoryServiceList;











