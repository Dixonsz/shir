import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import { Plus } from 'lucide-react';
import { getAdditionalColumns } from '../logic/AdditionalList.logic';
import '../AdditionalList.css';

function AdditionalList({ additionals, loading, onEdit, onDelete, onCreate }) {
  const columns = getAdditionalColumns();

  return (
    <div>
      <div className="additional-list-header">
        <h1 className="additional-list-title">Adicionales</h1>
        <Button onClick={onCreate}>
          <Plus size={20} />
          Nuevo Adicional
        </Button>
      </div>

      {loading ? (
        <p>Cargando adicionales...</p>
      ) : (
        <Table
          columns={columns}
          data={additionals}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}

export default AdditionalList;











