import Table from '../../../components/common/Table';
import EntityListView from '../../../components/layout/EntityListView';
import { getProductColumns } from '../logic/ProductList.logic.jsx';
import { usePermissions } from '../../auth/hooks';
import '../ProductList.css';

function ProductList({ products, loading, error, onCreate, onEdit, onDelete }) {
  const { canWriteResource } = usePermissions();
  const canWrite = canWriteResource('products');
  const columns = getProductColumns();

  return (
    <EntityListView
      title="Productos"
      description="Inventario y catalogo de productos"
      actionLabel="Nuevo Producto"
      onCreate={canWrite ? onCreate : undefined}
      loading={loading}
      error={error}
    >
        <Table
          columns={columns}
          data={products}
          onEdit={canWrite ? onEdit : undefined}
          onDelete={canWrite ? onDelete : undefined}
        />
    </EntityListView>
  );
}

export default ProductList;











