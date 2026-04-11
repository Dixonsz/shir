import Table from '../../../components/common/Table';
import EntityListView from '../../../components/layout/EntityListView';
import { getMemberColumns } from '../logic/MemberList.logic.jsx';
import { usePermissions } from '../../auth/hooks';
import '../MemberList.css';

function MemberList({ members, loading, error, onCreate, onEdit, onDelete, pagination, isMutating = false }) {
  const { canWriteResource } = usePermissions();
  const canWrite = canWriteResource('members');
  const columns = getMemberColumns();

  return (
    <EntityListView
      title="Miembros"
      description="Gestión del equipo de trabajo"
      actionLabel="Nuevo Miembro"
      onCreate={canWrite ? onCreate : undefined}
      actionDisabled={isMutating}
      actionLoading={isMutating}
      loading={loading}
      error={error}
    >
        <Table
          columns={columns}
          data={members}
          onEdit={canWrite && !isMutating ? onEdit : undefined}
          onDelete={canWrite && !isMutating ? onDelete : undefined}
          {...pagination}
        />
    </EntityListView>
  );
}

export default MemberList;











