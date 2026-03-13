import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/forms/Input';
import Textarea from '../../components/forms/Textarea';
import FormButtons from '../../components/forms/FormButtons';
import { ArrowLeft } from 'lucide-react';
import { useProductForm } from './ProductForm.logic';
import './ProductForm.css';

function ProductForm({ product, categories, onSubmit, onCancel }) {
  const { formData, handleChange } = useProductForm(product);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
      <div className="product-form-header">
        <Button onClick={onCancel} variant="secondary">
          <ArrowLeft size={20} />
          Volver
        </Button>
        <h1 className="product-form-title">
          {product ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
        <div style={{ width: '100px' }}></div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="product-form-row">
            <Input
              label="Nombre"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Nombre del producto"
            />
            <div className="product-form-select-container">
              <label className="product-form-label">Categoría</label>
              <select
                name="category_product_id"
                value={formData.category_product_id}
                onChange={handleChange}
                required
                className="product-form-select"
              >
                <option value="">Seleccione una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Textarea
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descripción del producto"
            rows={3}
          />

          <div className="product-form-row">
            <Input
              label="Precio"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="0.00"
            />
            <Input
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
              placeholder="0"
            />
          </div>

          <div className="product-form-checkbox-container">
            <label className="product-form-checkbox-label">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="product-form-checkbox"
              />
              <span>Activo</span>
            </label>
          </div>

          <FormButtons
            onCancel={onCancel}
            submitLabel={product ? 'Actualizar' : 'Crear'}
          />
        </form>
      </Card>
    </div>
  );
}

export default ProductForm;
