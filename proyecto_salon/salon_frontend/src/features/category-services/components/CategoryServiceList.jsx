import Table from '../../../components/common/Table';
import EntityListView from '../../../components/layout/EntityListView';
import { getCategoryServiceColumns } from '../logic/CategoryServiceList.logic.jsx';
import '../CategoryServiceList.css';

function CategoryServiceList({ categories, loading, error, onCreate, onEdit, onDelete }) {
  const columns = getCategoryServiceColumns();

  return (
    <EntityListView
      title="Categorías de Servicios"
      description="Gestión de categorías para el catálogo de servicios"
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

export default CategoryServiceList;











