import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import { Plus } from 'lucide-react';
import { getServiceColumns } from './ServiceList.logic.jsx';
import './ServiceList.css';

function ServiceList({ services, loading, error, onCreate, onEdit, onDelete }) {
  const columns = getServiceColumns();

  if (loading) {
    return <div className="service-list-message">Cargando servicios...</div>;
  }

  if (error) {
    return <div className="service-list-error">{error}</div>;
  }

  return (
    <div>
      <div className="service-list-header">
        <h1 className="service-list-title">Gestión de Servicios</h1>
        <Button onClick={onCreate} variant="primary">
          <Plus size={20} />
          Nuevo Servicio
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={services}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </Card>
    </div>
  );
}

export default ServiceList;
