import Table from '../../../components/common/Table';
import EntityListView from '../../../components/layout/EntityListView';
import { getCategoryProductColumns } from '../logic/CategoryProductList.logic.jsx';
import { usePermissions } from '../../auth/hooks';
import '../CategoryProductList.css';

function CategoryProductList({ categories, loading, error, onCreate, onEdit, onDelete, pagination, isMutating = false }) {
  const { canWriteResource } = usePermissions();
  const canWrite = canWriteResource('category_products');
  const columns = getCategoryProductColumns();

  return (
    <EntityListView
      title="Categorías de Productos"
      description="Gestión de categorías para el catálogo de productos"
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

export default CategoryProductList;











