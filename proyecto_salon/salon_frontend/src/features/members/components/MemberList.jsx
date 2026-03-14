import Table from '../../../components/common/Table';
import EntityListView from '../../../components/layout/EntityListView';
import { getMemberColumns } from '../logic/MemberList.logic.jsx';
import '../MemberList.css';

function MemberList({ members, loading, error, onCreate, onEdit, onDelete }) {
  const columns = getMemberColumns();

  return (
    <EntityListView
      title="Miembros"
      description="Gestión del equipo de trabajo"
      actionLabel="Nuevo Miembro"
      onCreate={onCreate}
      loading={loading}
      error={error}
    >
        <Table
          columns={columns}
          data={members}
          onEdit={onEdit}
          onDelete={onDelete}
        />
    </EntityListView>
  );
}

export default MemberList;











