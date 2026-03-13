import { useState } from 'react';
import { useClients } from './useClients';
import ClientList from './ClientList';
import ClientForm from './ClientForm';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';

function ClientsPage() {
  const { clients, loading, error, createClient, updateClient, deleteClient } = useClients();
  const { confirm } = useConfirm();
  const [view, setView] = useState('list');
  const [selectedClient, setSelectedClient] = useState(null);

  const handleCreate = () => {
    setSelectedClient(null);
    setView('form');
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setView('form');
  };

  const handleDelete = async (client) => {
    const confirmed = await confirm(
      `¿Está seguro de eliminar el cliente "${client.name}"?`,
      'Esta acción no se puede deshacer.'
    );

    if (confirmed) {
      const result = await deleteClient(client.id);
      if (result.success) {
        showToast.success('Cliente eliminado exitosamente');
      } else {
        showToast.error(result.error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    const result = selectedClient
      ? await updateClient(selectedClient.id, formData)
      : await createClient(formData);

    if (result.success) {
      setView('list');
      showToast.success(
        selectedClient
          ? 'Cliente actualizado exitosamente'
          : 'Cliente creado exitosamente'
      );
    } else {
      showToast.error(result.error);
    }
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
      loading={loading}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCreate={handleCreate}
    />
  );
}

export default ClientsPage;
