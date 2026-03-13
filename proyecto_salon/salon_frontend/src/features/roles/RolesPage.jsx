import { useNavigate } from 'react-router-dom';
import { useRoles } from './useRoles';
import RolesView from './RolesView';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';

function RolesPage() {
  const { roles, loading, error, deleteRole } = useRoles();
  const { confirm } = useConfirm();
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/dashboard/roles/new');
  };

  const handleEdit = (role) => {
    navigate(`/dashboard/roles/edit/${role.id}`);
  };

  const handleDelete = async (role) => {
    const confirmed = await confirm(
      `¿Está seguro de eliminar el rol "${role.name}"?`,
      {
        title: 'Confirmar eliminación',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      }
    );

    if (confirmed) {
      const result = await deleteRole(role.id);
      if (result.success) {
        showToast.success('Rol eliminado exitosamente');
      } else {
        showToast.error(result.error);
      }
    }
  };

  return (
    <RolesView
      roles={roles}
      loading={loading}
      error={error}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}

export default RolesPage;
