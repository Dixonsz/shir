import Table from '../../../components/common/Table';
import EntityListView from '../../../components/layout/EntityListView';
import { getPromotionColumns } from '../logic/PromotionList.logic.jsx';
import { usePermissions } from '../../auth/hooks';
import '../PromotionList.css';

function PromotionList({ promotions, loading, error, onEdit, onDelete, onCreate }) {
  const { canWriteResource } = usePermissions();
  const canWrite = canWriteResource('promotions');
  const columns = getPromotionColumns();

  return (
    <EntityListView
      title="Promociones"
      description="Gestión de promociones y descuentos"
      actionLabel="Nueva Promoción"
      onCreate={canWrite ? onCreate : undefined}
      loading={loading}
      error={error}
    >
        <Table
          columns={columns}
          data={promotions}
          onEdit={canWrite ? onEdit : undefined}
          onDelete={canWrite ? onDelete : undefined}
        />
    </EntityListView>
  );
}

export default PromotionList;











