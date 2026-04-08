import Table from '../../../components/common/Table';
import EntityListView from '../../../components/layout/EntityListView';
import { getProductColumns } from '../logic/ProductList.logic.jsx';
import { usePermissions } from '../../auth/hooks';
import { PackagePlus } from 'lucide-react';
import '../ProductList.css';

function ProductList({ products, loading, error, onCreate, onEdit, onDelete, onStockIn, pagination }) {
  const { canWriteResource } = usePermissions();
  const canWrite = canWriteResource('products');
  const columns = getProductColumns();

  const customActions = canWrite
    ? (row) => (
        <button
          type="button"
          onClick={() => onStockIn(row)}
          className="table-icon-btn product-stock-in-btn"
          title="Ingresar stock"
        >
          <PackagePlus size={18} />
        </button>
      )
    : undefined;

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
          customActions={customActions}
          onEdit={canWrite ? onEdit : undefined}
          onDelete={canWrite ? onDelete : undefined}
          {...pagination}
        />
    </EntityListView>
  );
}

export default ProductList;











