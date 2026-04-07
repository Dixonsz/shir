import { useCallback, useState } from 'react';
import { useProducts } from './hooks';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';
import { usePagination } from '../../hooks/usePagination';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../utils/constants';
import { productsApi } from './api';

function ProductsPage() {
  const { categories, loading, error, createProduct, updateProduct, deleteProduct } = useProducts();
  const { confirm } = useConfirm();
  const [view, setView] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProductsPage = useCallback(({ page, pageSize }) => {
    return productsApi.getAll({ page, pageSize });
  }, []);

  const {
    data: products,
    page,
    pages,
    total,
    pageSize,
    loading: paginationLoading,
    setPage,
    setPageSize,
    refresh,
  } = usePagination(fetchProductsPage, { pageSize: DEFAULT_PAGE_SIZE });

  const handleCreate = () => {
    setSelectedProduct(null);
    setView('form');
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setView('form');
  };

  const handleDelete = async (product) => {
    const confirmed = await confirm(
      `¿Está seguro de eliminar el producto "${product.name}"?`,
      {
        title: 'Confirmar eliminación',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      }
    );

    if (confirmed) {
      const productId = product.id ?? product.md;
      const result = await deleteProduct(productId);
      if (result.success) {
        await refresh();
        showToast.success('Producto eliminado exitosamente');
      } else {
        showToast.error(result.error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    const selectedId = selectedProduct?.id ?? selectedProduct?.md;
    const result = selectedProduct
      ? await updateProduct(selectedId, formData)
      : await createProduct(formData);

    if (result.success) {
      await refresh();
      setView('list');
      showToast.success(
        selectedProduct
          ? 'Producto actualizado exitosamente'
          : 'Producto creado exitosamente'
      );
    } else {
      showToast.error(result.error);
    }
  };

  const handleCancel = () => {
    setSelectedProduct(null);
    setView('list');
  };

  if (view === 'form') {
    return (
      <ProductForm
        product={selectedProduct}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ProductList
      products={products}
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

export default ProductsPage;





