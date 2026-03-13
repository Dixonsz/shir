import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import { Plus } from 'lucide-react';
import { getProductColumns } from './ProductList.logic.jsx';
import './ProductList.css';

function ProductList({ products, loading, error, onCreate, onEdit, onDelete }) {
  const columns = getProductColumns();

  if (loading) {
    return <div className="product-list-message">Cargando productos...</div>;
  }

  if (error) {
    return <div className="product-list-error">{error}</div>;
  }

  return (
    <div>
      <div className="product-list-header">
        <h1 className="product-list-title">Gestión de Productos</h1>
        <Button onClick={onCreate} variant="primary">
          <Plus size={20} />
          Nuevo Producto
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={products}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </Card>
    </div>
  );
}

export default ProductList;
