import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/forms/Input';
import Textarea from '../../components/forms/Textarea';
import FormButtons from '../../components/forms/FormButtons';
import { ArrowLeft, Plus } from 'lucide-react';
import { useServiceForm } from './ServiceForm.logic';
import './ServiceForm.css';

function ServiceForm({ service, categories, onSubmit, onCancel, onCategoryCreated }) {
  const {
    formData,
    showCategoryModal,
    setShowCategoryModal,
    newCategory,
    setNewCategory,
    handleChange,
    handleCreateCategory,
  } = useServiceForm(service, onCategoryCreated);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
      <div className="service-form-header">
        <Button onClick={onCancel} variant="secondary">
          <ArrowLeft size={20} />
          Volver
        </Button>
        <h1 className="service-form-title">
          {service ? 'Editar Servicio' : 'Nuevo Servicio'}
        </h1>
        <div style={{ width: '100px' }}></div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="service-form">
          <div className="service-form-row">
            <Input
              label="Nombre"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Nombre del servicio"
            />
            <div className="service-form-select-container">
              <label className="service-form-label">Categoría</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  name="category_service_id"
                  value={formData.category_service_id}
                  onChange={handleChange}
                  required
                  className="service-form-select"
                  style={{ flex: 1 }}
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCategoryModal(true)}
                  title="Crear nueva categoría"
                  style={{ padding: '8px 12px' }}
                >
                  <Plus size={20} />
                </Button>
              </div>
            </div>
          </div>

          <Textarea
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descripción del servicio"
            rows={3}
          />

          <div className="service-form-row">
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
              label="Duración (minutos)"
              name="duration_minutes"
              type="number"
              value={formData.duration_minutes}
              onChange={handleChange}
              required
              placeholder="0"
            />
          </div>

          <div className="service-form-checkbox-container">
            <label className="service-form-checkbox-label">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="service-form-checkbox"
              />
              <span>Activo</span>
            </label>
          </div>

          <FormButtons
            onCancel={onCancel}
            submitLabel={service ? 'Actualizar' : 'Crear'}
          />
        </form>
      </Card>

      {/* Modal para crear categoría */}
      {showCategoryModal && (
        <div className="service-form-modal-overlay">
          <div className="service-form-modal">
            <h2 className="service-form-modal-title">Nueva Categoría</h2>
            <form onSubmit={handleCreateCategory} className="service-form-modal-form">
              <Input
                label="Nombre"
                name="name"
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="Nombre de la categoría"
              />
              <Textarea
                label="Descripción"
                name="description"
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción de la categoría"
                rows={3}
              />
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setNewCategory({ name: '', description: '' });
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  Crear Categoría
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceForm;
