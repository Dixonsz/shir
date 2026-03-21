import { useNavigate } from 'react-router-dom';
import { useMembers } from './hooks';
import MemberList from './components/MemberList';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';

function MembersPage() {
  const { members, loading, error, deleteMember } = useMembers();
  const { Confirm } = useConfirm();
  const Navigate = useNavigate();

  const handleCreate = () => {
    Navigate('/dashboard/members/new');
  };

  const handleEdit = (member) => {
    Navigate(`/dashboard/members/edit/${member.id ?? member.md}`);
  };

  const handleDelete = async (member) => {
    const Confirmed = await Confirm(
      `¿Está seguro de eliminar al miembro "${member.first_name} ${member.last_name}"?`,
      {
        title: 'Confirmar eliminación',
        ConfirmText: 'Eliminar',
        cancelText: 'Cancelar',
      }
    );

    if (Confirmed) {
      const result = await deleteMember(member.id ?? member.md);
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






