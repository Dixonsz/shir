import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import { Plus } from 'lucide-react';
import { getPromotionColumns } from './PromotionList.logic.jsx';
import './PromotionList.css';

function PromotionList({ promotions, loading, onEdit, onDelete, onCreate }) {
  const columns = getPromotionColumns();

  return (
    <div>
      <div className="promotion-list-header">
        <h1 className="promotion-list-title">Promociones</h1>
        <Button onClick={onCreate}>
          <Plus size={20} />
          Nueva Promoción
        </Button>
      </div>

      {loading ? (
        <p>Cargando promociones...</p>
      ) : (
        <Table
          columns={columns}
          data={promotions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}

export default PromotionList;
