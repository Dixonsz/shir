import { useCallback, useState } from 'react';
import { useClients } from './hooks';
import ClientList from './components/ClientList';
import ClientForm from './components/ClientForm';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';
import { usePagination } from '../../hooks/usePagination';
import { useMutationLock } from '../../hooks/useMutationLock';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../utils/constants';
import { clientsApi } from './api';

function ClientsPage() {
  const { loading, error, createClient, updateClient, deleteClient } = useClients();
  const { confirm } = useConfirm();
  const [view, setView] = useState('list');
  const [selectedClient, setSelectedClient] = useState(null);
  const { isLocked: isMutating, runWithLock } = useMutationLock();

  const fetchClientsPage = useCallback(({ page, pageSize }) => {
    return clientsApi.getAll({ page, pageSize });
  }, []);

  const {
    data: clients,
    page,
    pages,
    total,
    pageSize,
    loading: paginationLoading,
    setPage,
    setPageSize,
    refresh,
  } = usePagination(fetchClientsPage, { pageSize: DEFAULT_PAGE_SIZE });

  const handleCreate = () => {
    if (isMutating) return;
    setSelectedClient(null);
    setView('form');
  };

  const handleEdit = (client) => {
    if (isMutating) return;
    setSelectedClient(client);
    setView('form');
  };

  const handleDelete = async (client) => {
    await runWithLock(async () => {
      const confirmed = await confirm(
        `¿Está seguro de eliminar el cliente "${client.name}"?`,
        { title: 'Confirmar eliminación', confirmText: 'Eliminar' }
      );

      if (confirmed) {
        const result = await deleteClient(client.id);
        if (result.success) {
          await refresh();
          showToast.success('Cliente eliminado exitosamente');
        } else {
          showToast.error(result.error);
        }
      }
    });
  };

  const handleSubmit = async (formData) => {
    await runWithLock(async () => {
      const result = selectedClient
        ? await updateClient(selectedClient.id, formData)
        : await createClient(formData);

      if (result.success) {
        await refresh();
        setView('list');
        showToast.success(
          selectedClient
            ? 'Cliente actualizado exitosamente'
            : 'Cliente creado exitosamente'
        );
      } else {
        showToast.error(result.error);
      }
    });
  };

  const handleCancel = () => {
    setSelectedClient(null);
    setView('list');
  };

  if (view === 'form') {
    return (
      <ClientForm
        client={selectedClient}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ClientList
      clients={clients}
      loading={loading || paginationLoading}
      isMutating={isMutating}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCreate={handleCreate}
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

export default ClientsPage;





