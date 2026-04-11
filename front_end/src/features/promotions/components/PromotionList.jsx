import Table from '../../../components/common/Table';
import EntityListView from '../../../components/layout/EntityListView';
import { getPromotionColumns } from '../logic/PromotionList.logic.jsx';
import { usePermissions } from '../../auth/hooks';
import '../PromotionList.css';

function PromotionList({ promotions, loading, error, onEdit, onDelete, onCreate, pagination, isMutating = false }) {
  const { canWriteResource } = usePermissions();
  const canWrite = canWriteResource('promotions');
  const columns = getPromotionColumns();

  return (
    <EntityListView
      title="Promociones"
      description="Gestión de promociones y descuentos"
      actionLabel="Nueva Promoción"
      onCreate={canWrite ? onCreate : undefined}
      actionDisabled={isMutating}
      actionLoading={isMutating}
      loading={loading}
      error={error}
    >
        <Table
          columns={columns}
          data={promotions}
          onEdit={canWrite && !isMutating ? onEdit : undefined}
          onDelete={canWrite && !isMutating ? onDelete : undefined}
          {...pagination}
        />
    </EntityListView>
  );
}

export default PromotionList;











