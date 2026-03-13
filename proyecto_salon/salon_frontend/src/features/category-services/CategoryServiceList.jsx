import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import { Plus } from 'lucide-react';
import { getCategoryServiceColumns } from './CategoryServiceList.logic.jsx';
import './CategoryServiceList.css';

function CategoryServiceList({ categories, loading, error, onCreate, onEdit, onDelete }) {
  const columns = getCategoryServiceColumns();

  if (loading) {
    return <div className="category-service-list-message">Cargando categorías...</div>;
  }

  if (error) {
    return <div className="category-service-list-error">{error}</div>;
  }

  return (
    <div>
      <div className="category-service-list-header">
        <h1 className="category-service-list-title">Gestión de Categorías de Servicios</h1>
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

export default CategoryServiceList;
