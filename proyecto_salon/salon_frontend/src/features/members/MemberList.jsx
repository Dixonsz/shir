import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import { Plus } from 'lucide-react';
import { getMemberColumns } from './MemberList.logic.jsx';
import './MemberList.css';

function MemberList({ members, loading, error, onCreate, onEdit, onDelete }) {
  const columns = getMemberColumns();

  if (loading) {
    return <div className="member-list-message">Cargando miembros...</div>;
  }

  if (error) {
    return <div className="member-list-error">{error}</div>;
  }

  return (
    <div>
      <div className="member-list-header">
        <h1 className="member-list-title">Gestión de Miembros</h1>
        <Button onClick={onCreate} variant="primary">
          <Plus size={20} />
          Nuevo Miembro
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={members}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </Card>
    </div>
  );
}

export default MemberList;
