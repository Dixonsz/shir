import Table from '../../../components/common/Table';
import EntityListView from '../../../components/layout/EntityListView';
import { getProductColumns } from '../logic/ProductList.logic.jsx';
import '../ProductList.css';

function ProductList({ products, loading, error, onCreate, onEdit, onDelete }) {
  const columns = getProductColumns();

  return (
    <EntityListView
      title="Productos"
      description="Inventario y catalogo de productos"
      actionLabel="Nuevo Producto"
      onCreate={onCreate}
      loading={loading}
      error={error}
    >
        <Table
          columns={columns}
          data={products}
          onEdit={onEdit}
          onDelete={onDelete}
        />
    </EntityListView>
  );
}

export default ProductList;











