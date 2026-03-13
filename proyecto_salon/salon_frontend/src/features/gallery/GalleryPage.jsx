import { useState } from 'react';
import { useGallery } from './useGallery';
import GalleryList from './GalleryList';
import GalleryForm from './GalleryForm';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';

function GalleryPage() {
  const { galleryItems, loading, error, uploadImage, updateItem, deleteItem, toggleItemStatus } = useGallery();
  const { confirm } = useConfirm();
  const [view, setView] = useState('list');
  const [selectedItem, setSelectedItem] = useState(null);

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
      showToast.success('Imagen eliminada permanentemente');
    } else {
      showToast.error(result.error);
    }
  };

  const handleToggleStatus = async (itemId) => {
    const result = await toggleItemStatus(itemId);
    if (result.success) {
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
      loading={loading}
      error={error}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onToggleStatus={handleToggleStatus}
    />
  );
}

export default GalleryPage;
