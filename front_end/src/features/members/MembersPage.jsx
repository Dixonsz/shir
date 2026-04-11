import { useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { useMembers } from './hooks';
import MemberList from './components/MemberList';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';
import { usePagination } from '../../hooks/usePagination';
import { useMutationLock } from '../../hooks/useMutationLock';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../utils/constants';
import { membersApi } from './api';

function MembersPage() {
  const { loading, error, deleteMember } = useMembers();
  const { Confirm } = useConfirm();
  const Navigate = useNavigate();
  const { isLocked: isMutating, runWithLock } = useMutationLock();

  const fetchMembersPage = useCallback(({ page, pageSize }) => {
    return membersApi.getAll({ page, pageSize });
  }, []);

  const {
    data: members,
    page,
    pages,
    total,
    pageSize,
    loading: paginationLoading,
    setPage,
    setPageSize,
    refresh,
  } = usePagination(fetchMembersPage, { pageSize: DEFAULT_PAGE_SIZE });

  const handleCreate = () => {
    if (isMutating) return;
    Navigate('/dashboard/members/new');
  };

  const handleEdit = (member) => {
    if (isMutating) return;
    Navigate(`/dashboard/members/edit/${member.id ?? member.md}`);
  };

  const handleDelete = async (member) => {
    await runWithLock(async () => {
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
          await refresh();
          showToast.success('Miembro eliminado exitosamente');
        } else {
          showToast.error(result.error);
        }
      }
    });
  };

  return (
    <MemberList
      members={members}
      loading={loading || paginationLoading}
      error={error}
      isMutating={isMutating}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      pagination={{
        page,
        pages,
        total,
        pageSize,
        onPageChange: setPage,
        onPageSizeChange: setPageSize,
        pageSizeOptions: PAGE_SIZE_OPTIONS,
      }}
    />
  );
}

export default MembersPage;






