import { useCallback, useState } from 'react';
import { useGallery } from './hooks';
import GalleryList from './components/GalleryList';
import GalleryForm from './components/GalleryForm';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';
import { usePagination } from '../../hooks/usePagination';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../utils/constants';
import { galleryApi } from './api';

function GalleryPage() {
  const { loading, error, uploadImage, updateItem, deleteItem, toggleItemStatus } = useGallery();
  const { Confirm } = useConfirm();
  const [view, setView] = useState('list');
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchGalleryPage = useCallback(({ page, pageSize }) => {
    return galleryApi.getAllAdmin({ page, pageSize });
  }, []);

  const {
    data: galleryItems,
    page,
    pages,
    total,
    pageSize,
    loading: paginationLoading,
    setPage,
    setPageSize,
    refresh,
  } = usePagination(fetchGalleryPage, { pageSize: DEFAULT_PAGE_SIZE });

  const handleCreate = () => {
    setSelectedItem(null);
    setView('form');
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setView('form');
  };

  const handleDelete = async (itemId) => {
    const result = await deleteItem(itemId);
    if (result.success) {
      await refresh();
      showToast.success('Imagen eliminada permanentemente');
    } else {
      showToast.error(result.error);
    }
  };

  const handleToggleStatus = async (itemId) => {
    const result = await toggleItemStatus(itemId);
    if (result.success) {
      await refresh();
      const newStatus = result.data.is_active ? 'activado' : 'desactivado';
      showToast.success(`Item ${newStatus} exitosamente`);
    } else {
      showToast.error(result.error);
    }
  };

  const handleSubmit = async (formData, itemId) => {
    let result;
    
    if (itemId) {
      const data = {
        title: formData.get('title'),
        description: formData.get('description'),
        order: formData.get('order'),
      };
      result = await updateItem(itemId, data);
    } else {
      result = await uploadImage(formData);
    }

    if (result.success) {
      await refresh();
      setView('list');
      showToast.success(
        itemId
          ? 'Imagen actualizada exitosamente'
          : 'Imagen subida exitosamente'
      );
    } else {
      showToast.error(result.error);
    }
  };

  const handleCancel = () => {
    setSelectedItem(null);
    setView('list');
  };

  if (view === 'form') {
    return (
      <GalleryForm
        item={selectedItem}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <GalleryList
      galleryItems={galleryItems}
      loading={loading || paginationLoading}
      error={error}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onToggleStatus={handleToggleStatus}
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

export default GalleryPage;





