import { useState } from 'react';
import { useAdditionals } from './hooks';
import AdditionalList from './components/AdditionalList';
import AdditionalForm from './components/AdditionalForm';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';

function AdditionalsPage() {
  const { Additionals, loading, error, createAdditional, updateAdditional, deleteAdditional } = useAdditionals();
  const { Confirm } = useConfirm();
  const [view, setview] = useState('List');
  const [selectedAdditional, setSelectedAdditional] = useState(null);

  const handleCreate = () => {
    setSelectedAdditional(null);
    setview('form');
  };

  const handleEdit = (Additional) => {
    setSelectedAdditional(Additional);
    setview('form');
  };

  const handleDelete = async (Additional) => {
    const Confirmed = await Confirm(
      `¿Está seguro de eliminar este adicional?`,
      'Esta acción no se puede deshacer.'
    );

    if (Confirmed) {
      const result = await deleteAdditional(Additional.md);
      if (result.success) {
        showToast.success('Adicional eliminado exitosamente');
      } else {
        showToast.error(result.error);
      }
    }
  };

  const handlesubmit = async (formData) => {
    const result = selectedAdditional
      ? await updateAdditional(selectedAdditional.md, formData)
      : await createAdditional(formData);

    if (result.success) {
      setview('List');
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
    setview('List');
  };

  if (view === 'form') {
    return (
      <AdditionalForm
        Additional={selectedAdditional}
        onSubmit={handlesubmit}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <AdditionalList
      Additionals={Additionals}
      loading={loading}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCreate={handleCreate}
    />
  );
}

export default AdditionalsPage;





