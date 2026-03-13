import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import { Plus } from 'lucide-react';
import { getCategoryProductColumns } from './CategoryProductList.logic.jsx';
import './CategoryProductList.css';

function CategoryProductList({ categories, loading, error, onCreate, onEdit, onDelete }) {
  const columns = getCategoryProductColumns();

  if (loading) {
    return <div className="category-product-list-message">Cargando categorías...</div>;
  }

  if (error) {
    return <div className="category-product-list-error">{error}</div>;
  }

  return (
    <div>
      <div className="category-product-list-header">
        <h1 className="category-product-list-title">Gestión de Categorías de Productos</h1>
        <Button onClick={onCreate} variant="primary">
          <Plus size={20} />
          Nueva Categoría
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={categories}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </Card>
    </div>
  );
}

export default CategoryProductList;
