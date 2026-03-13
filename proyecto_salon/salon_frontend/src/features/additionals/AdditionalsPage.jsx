import { useState } from 'react';
import { useAdditionals } from './useAdditionals';
import AdditionalList from './AdditionalList';
import AdditionalForm from './AdditionalForm';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';

function AdditionalsPage() {
  const { additionals, loading, error, createAdditional, updateAdditional, deleteAdditional } = useAdditionals();
  const { confirm } = useConfirm();
  const [view, setView] = useState('list');
  const [selectedAdditional, setSelectedAdditional] = useState(null);

  const handleCreate = () => {
    setSelectedAdditional(null);
    setView('form');
  };

  const handleEdit = (additional) => {
    setSelectedAdditional(additional);
    setView('form');
  };

  const handleDelete = async (additional) => {
    const confirmed = await confirm(
      `¿Está seguro de eliminar este adicional?`,
      'Esta acción no se puede deshacer.'
    );

    if (confirmed) {
      const result = await deleteAdditional(additional.id);
      if (result.success) {
        showToast.success('Adicional eliminado exitosamente');
      } else {
        showToast.error(result.error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    const result = selectedAdditional
      ? await updateAdditional(selectedAdditional.id, formData)
      : await createAdditional(formData);

    if (result.success) {
      setView('list');
      showToast.success(
        selectedAdditional
          ? 'Adicional actualizado exitosamente'
          : 'Adicional creado exitosamente'
      );
    } else {
      showToast.error(result.error);
    }
  };

  const handleCancel = () => {
    setSelectedAdditional(null);
    setView('list');
  };

  if (view === 'form') {
    return (
      <AdditionalForm
        additional={selectedAdditional}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <AdditionalList
      additionals={additionals}
      loading={loading}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCreate={handleCreate}
    />
  );
}

export default AdditionalsPage;
