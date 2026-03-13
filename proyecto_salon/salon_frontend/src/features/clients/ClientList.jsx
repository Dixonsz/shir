import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import { Plus } from 'lucide-react';
import { getClientColumns } from './ClientList.logic.jsx';
import './ClientList.css';

function ClientList({ clients, loading, onEdit, onDelete, onCreate }) {
  const columns = getClientColumns();

  return (
    <div>
      <div className="client-list-header">
        <h1 className="client-list-title">Clientes</h1>
        <Button onClick={onCreate}>
          <Plus size={20} />
          Nuevo Cliente
        </Button>
      </div>

      {loading ? (
        <p>Cargando clientes...</p>
      ) : (
        <Table
          columns={columns}
          data={clients}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}

export default ClientList;
