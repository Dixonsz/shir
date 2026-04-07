import { useCallback, useState } from 'react';
import { usePromotions } from './hooks';
import PromotionList from './components/PromotionList';
import PromotionForm from './components/PromotionForm';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';
import { usePagination } from '../../hooks/usePagination';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../utils/constants';
import { promotionsApi } from './api';

function PromotionsPage() {
  const { loading, error, createPromotion, updatePromotion, deletePromotion } = usePromotions();
  const { Confirm } = useConfirm();
  const [view, setView] = useState('list');
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  const fetchPromotionsPage = useCallback(({ page, pageSize }) => {
    return promotionsApi.getAll({ page, pageSize });
  }, []);

  const {
    data: promotions,
    page,
    pages,
    total,
    pageSize,
    loading: paginationLoading,
    setPage,
    setPageSize,
    refresh,
  } = usePagination(fetchPromotionsPage, { pageSize: DEFAULT_PAGE_SIZE });

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
        await refresh();
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
      await refresh();
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
      loading={loading || paginationLoading}
      error={error}
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

export default PromotionsPage;





