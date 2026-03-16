import Table from '../../../components/common/Table';
import EntityListView from '../../../components/layout/EntityListView';
import { getCategoryProductColumns } from '../logic/CategoryProductList.logic.jsx';
import { usePermissions } from '../../auth/hooks';
import '../CategoryProductList.css';

function CategoryProductList({ categories, loading, error, onCreate, onEdit, onDelete }) {
  const { canWriteResource } = usePermissions();
  const canWrite = canWriteResource('category_products');
  const columns = getCategoryProductColumns();

  return (
    <EntityListView
      title="Categorías de Productos"
      description="Gestión de categorías para el catálogo de productos"
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

export default CategoryProductList;











