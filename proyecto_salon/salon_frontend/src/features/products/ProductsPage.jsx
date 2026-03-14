import { useState } from 'react';
import { useProducts } from './hooks';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';

function ProductsPage() {
  const { products, categories, loading, error, createProduct, updateProduct, deleteProduct } = useProducts();
  const { confirm } = useConfirm();
  const [view, setView] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(null);

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
      loading={loading}
      error={error}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}

export default ProductsPage;





