import Table from '../../../components/common/Table';
import EntityListView from '../../../components/layout/EntityListView';
import { getCategoryProductColumns } from '../logic/CategoryProductList.logic.jsx';
import '../CategoryProductList.css';

function CategoryProductList({ categories, loading, error, onCreate, onEdit, onDelete }) {
  const columns = getCategoryProductColumns();

  return (
    <EntityListView
      title="Categorías de Productos"
      description="Gestión de categorías para el catálogo de productos"
      actionLabel="Nueva Categoría"
      onCreate={onCreate}
      loading={loading}
      error={error}
    >
        <Table
          columns={columns}
          data={categories}
          onEdit={onEdit}
          onDelete={onDelete}
        />
    </EntityListView>
  );
}

export default CategoryProductList;











