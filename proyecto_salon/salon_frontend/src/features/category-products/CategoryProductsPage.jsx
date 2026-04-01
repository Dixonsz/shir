import { useCallback, useState } from 'react';
import { useCategoryProducts } from './hooks';
import CategoryProductList from './components/CategoryProductList';
import CategoryProductForm from './components/CategoryProductForm';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';
import { usePagination } from '../../hooks/usePagination';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../utils/constants';
import { categoryProductsApi } from './api';

function CategoryProductsPage() {
  const { loading, error, createCategory, updateCategory, deleteCategory } = useCategoryProducts();
  const { Confirm } = useConfirm();
  const [view, setView] = useState('list');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategoriesPage = useCallback(({ page, pageSize }) => {
    return categoryProductsApi.getAll({ page, pageSize });
  }, []);

  const {
    data: categories,
    page,
    pages,
    total,
    pageSize,
    loading: paginationLoading,
    setPage,
    setPageSize,
    refresh,
  } = usePagination(fetchCategoriesPage, { pageSize: DEFAULT_PAGE_SIZE });

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
        await refresh();
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
      await refresh();
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
      loading={loading || paginationLoading}
      error={error}
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

export default CategoryProductsPage;





