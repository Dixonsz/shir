import Table from '../../../components/common/Table';
import EntityListView from '../../../components/layout/EntityListView';
import { getPromotionColumns } from '../logic/PromotionList.logic.jsx';
import '../PromotionList.css';

function PromotionList({ promotions, loading, error, onEdit, onDelete, onCreate }) {
  const columns = getPromotionColumns();

  return (
    <EntityListView
      title="Promociones"
      description="Gestión de promociones y descuentos"
      actionLabel="Nueva Promoción"
      onCreate={onCreate}
      loading={loading}
      error={error}
    >
        <Table
          columns={columns}
          data={promotions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
    </EntityListView>
  );
}

export default PromotionList;











