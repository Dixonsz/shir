import { useNavigate } from 'react-router-dom';
import { useMembers } from './useMembers';
import MemberList from './MemberList';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';

function MembersPage() {
  const { members, loading, error, deleteMember } = useMembers();
  const { confirm } = useConfirm();
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/dashboard/members/new');
  };

  const handleEdit = (member) => {
    navigate(`/dashboard/members/edit/${member.id}`);
  };

  const handleDelete = async (member) => {
    const confirmed = await confirm(
      `¿Está seguro de eliminar al miembro "${member.first_name} ${member.last_name}"?`,
      {
        title: 'Confirmar eliminación',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      }
    );

    if (confirmed) {
      const result = await deleteMember(member.id);
      if (result.success) {
        showToast.success('Miembro eliminado exitosamente');
      } else {
        showToast.error(result.error);
      }
    }
  };

  return (
    <MemberList
      members={members}
      loading={loading}
      error={error}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}

export default MembersPage;

