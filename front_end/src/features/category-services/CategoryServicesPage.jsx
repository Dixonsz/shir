import { useCallback, useState } from 'react';
import { useCategoryServices } from './hooks';
import CategoryServiceList from './components/CategoryServiceList';
import CategoryServiceForm from './components/CategoryServiceForm';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';
import { usePagination } from '../../hooks/usePagination';
import { useMutationLock } from '../../hooks/useMutationLock';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../utils/constants';
import { categoryServicesApi } from './api';

function CategoryServicesPage() {
  const { loading, error, createCategory, updateCategory, deleteCategory } = useCategoryServices();
  const { Confirm } = useConfirm();
  const [view, setView] = useState('list');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { isLocked: isMutating, runWithLock } = useMutationLock();

  const fetchCategoriesPage = useCallback(({ page, pageSize }) => {
    return categoryServicesApi.getAll({ page, pageSize });
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
    if (isMutating) return;
    setSelectedCategory(null);
    setView('form');
  };

  const handleEdit = (category) => {
    if (isMutating) return;
    setSelectedCategory(category);
    setView('form');
  };

  const handleDelete = async (category) => {
    await runWithLock(async () => {
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
    });
  };

  const handleSubmit = async (formData) => {
    await runWithLock(async () => {
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
    });
  };

  const handleCancel = () => {
    setSelectedCategory(null);
    setView('list');
  };

  if (view === 'form') {
    return (
      <CategoryServiceForm
        category={selectedCategory}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <CategoryServiceList
      categories={categories}
      loading={loading || paginationLoading}
      error={error}
      isMutating={isMutating}
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

export default CategoryServicesPage;





