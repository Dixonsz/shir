import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/forms/Input';
import Textarea from '../../components/forms/Textarea';
import FormButtons from '../../components/forms/FormButtons';
import { ArrowLeft } from 'lucide-react';
import { useCategoryForm } from './CategoryProductForm.logic';
import './CategoryProductForm.css';

function CategoryProductForm({ category, onSubmit, onCancel }) {
  const { formData, handleChange } = useCategoryForm(category);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
      <div className="category-product-form-header">
        <Button onClick={onCancel} variant="secondary">
          <ArrowLeft size={20} />
          Volver
        </Button>
        <h1 className="category-product-form-title">
          {category ? 'Editar Categoría' : 'Nueva Categoría'}
        </h1>
        <div style={{ width: '100px' }}></div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="category-product-form">
          <Input
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Nombre de la categoría"
          />

          <Textarea
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descripción de la categoría"
            rows={3}
          />

          <div className="category-product-form-checkbox-container">
            <label className="category-product-form-checkbox-label">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="category-product-form-checkbox"
              />
              <span>Activo</span>
            </label>
          </div>

          <FormButtons
            onCancel={onCancel}
            submitLabel={category ? 'Actualizar' : 'Crear'}
          />
        </form>
      </Card>
    </div>
  );
}

export default CategoryProductForm;
