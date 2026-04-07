import Input from '../../../components/forms/Input';
import Textarea from '../../../components/forms/Textarea';
import FormButtons from '../../../components/forms/FormButtons';
import EntityFormView from '../../../components/layout/EntityFormView';
import { useCategoryForm } from '../logic/CategoryServiceForm.logic';
import '../CategoryServiceForm.css';

function CategoryServiceForm({ category, onSubmit, onCancel }) {
  const { formData, handleChange } = useCategoryForm(category);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <EntityFormView title={category ? 'Editar Categoría' : 'Nueva Categoría'} onBack={onCancel}>
        <form onSubmit={handleSubmit} className="category-service-form">
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

          <div className="category-service-form-checkbox-container">
            <label className="category-service-form-checkbox-label">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="category-service-form-checkbox"
              />
              <span>Activo</span>
            </label>
          </div>

          <FormButtons
            onCancel={onCancel}
            submitLabel={category ? 'Actualizar' : 'Crear'}
          />
        </form>
    </EntityFormView>
  );
}

export default CategoryServiceForm;











