import { useState } from 'react';
import { useCategoryProducts } from './hooks';
import CategoryProductList from './components/CategoryProductList';
import CategoryProductForm from './components/CategoryProductForm';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';

function CategoryProductsPage() {
  const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useCategoryProducts();
  const { Confirm } = useConfirm();
  const [view, setView] = useState('list');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCreate = () => {
    setSelectedCategory(null);
    setView('form');
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setView('form');
  };

  const handleDelete = async (category) => {
    const Confirmed = await Confirm(
      `¿Está seguro de eliminar la categoría "${category.name}"?`,
      {
        title: 'Confirmar eliminación',
        ConfirmText: 'Eliminar  categoría',
        cancelText: 'Cancelar',
      }
    );

    if (Confirmed) {
      const result = await deleteCategory(category.id ?? category.md);
      if (result.success) {
        showToast.success('Categoría eliminada exitosamente');
      } else {
        showToast.error(result.error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    const result = selectedCategory
      ? await updateCategory(selectedCategory.id ?? selectedCategory.md, formData)
      : await createCategory(formData);

    if (result.success) {
      setView('list');
      showToast.success(
        selectedCategory
          ? 'Categoría actualizada exitosamente'
          : 'Categoría creada exitosamente'
      );
    } else {
      showToast.error(result.error);
    }
  };

  const handleCancel = () => {
    setSelectedCategory(null);
    setView('list');
  };

  if (view === 'form') {
    return (
      <CategoryProductForm
        category={selectedCategory}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <CategoryProductList
      categories={categories}
      loading={loading}
      error={error}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}

export default CategoryProductsPage;





