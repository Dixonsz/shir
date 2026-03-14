import { useState } from 'react';
import { usePromotions } from './hooks';
import PromotionList from './components/PromotionList';
import PromotionForm from './components/PromotionForm';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';

function PromotionsPage() {
  const { Promotions: promotions, loading, error, createPromotion, updatePromotion, deletePromotion } = usePromotions();
  const { Confirm } = useConfirm();
  const [view, setView] = useState('list');
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  const handleCreate = () => {
    setSelectedPromotion(null);
    setView('form');
  };

  const handleEdit = (promotion) => {
    setSelectedPromotion(promotion);
    setView('form');
  };

  const handleDelete = async (promotion) => {
    const Confirmed = await Confirm(
      `¿Está seguro de eliminar la promoción "${promotion.name}"?`,
      'Esta acción no se puede deshacer.'
    );

    if (Confirmed) {
      const result = await deletePromotion(promotion.id ?? promotion.md);
      if (result.success) {
        showToast.success('Promoción eliminada exitosamente');
      } else {
        showToast.error(result.error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    const result = selectedPromotion
      ? await updatePromotion(selectedPromotion.id ?? selectedPromotion.md, formData)
      : await createPromotion(formData);

    if (result.success) {
      setView('list');
      showToast.success(
        selectedPromotion
          ? 'Promoción actualizada exitosamente'
          : 'Promoción creada exitosamente'
      );
    } else {
      showToast.error(result.error);
    }
  };

  const handleCancel = () => {
    setSelectedPromotion(null);
    setView('list');
  };

  if (view === 'form') {
    return (
      <PromotionForm
        promotion={selectedPromotion}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <PromotionList
      promotions={promotions}
      loading={loading}
      error={error}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCreate={handleCreate}
    />
  );
}

export default PromotionsPage;





