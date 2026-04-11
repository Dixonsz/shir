import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import { Plus } from 'lucide-react';
import { getAdditionalColumns } from '../logic/AdditionalList.logic';
import '../AdditionalList.css';

function AdditionalList({ additionals, Additionals, loading, onEdit, onDelete, onCreate, isMutating = false }) {
  const columns = getAdditionalColumns();
  const rows = Array.isArray(additionals)
    ? additionals
    : Array.isArray(Additionals)
      ? Additionals
      : [];

  return (
    <div>
      <div className="additional-list-header">
        <h1 className="additional-list-title">Adicionales</h1>
        <Button onClick={onCreate} disabled={isMutating}>
          <Plus size={20} />
          {isMutating ? 'Procesando...' : 'Nuevo Adicional'}
        </Button>
      </div>

      {loading ? (
        <p>Cargando adicionales...</p>
      ) : (
        <Table
          columns={columns}
          data={rows}
          onEdit={isMutating ? undefined : onEdit}
          onDelete={isMutating ? undefined : onDelete}
        />
      )}
    </div>
  );
}

export default AdditionalList;











