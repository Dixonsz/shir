import { useState } from 'react';
import Button from '../../../components/common/Button';
import Input from '../../../components/forms/Input';
import Textarea from '../../../components/forms/Textarea';
import FormButtons from '../../../components/forms/FormButtons';
import { Plus } from 'lucide-react';
import EntityFormView from '../../../components/layout/EntityFormView';
import Modal from '../../../components/common/Modal';
import { useMutationLock } from '../../../hooks/useMutationLock';
import { useServiceForm } from '../logic/ServiceForm.logic';
import '../ServiceForm.css';

function ServiceForm({ service, categories = [], onSubmit, onCancel, onCategoryCreated }) {
  const { isLocked: isSubmitting, runWithLock } = useMutationLock();
  const { isLocked: isCreatingCategory, runWithLock: runWithCategoryLock } = useMutationLock();
  const {
    formData,
    showCategoryModal,
    setShowCategoryModal,
    newCategory,
    setNewCategory,
    handleChange,
    handleCreateCategory,
  } = useServiceForm(service, onCategoryCreated);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await runWithLock(async () => {
      await onSubmit(formData);
    });
  };

  const handleSubmitCategory = async (e) => {
    await runWithCategoryLock(async () => {
      await handleCreateCategory(e);
    });
  };

  return (
    <>
      <EntityFormView title={service ? 'Editar Servicio' : 'Nuevo Servicio'} onBack={onCancel}>
        <form onSubmit={handleSubmit} className="service-form">
          <div className="service-form-row">
            <Input
              label="Nombre"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
            disabled={isSubmitting}
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
              disabled={isSubmitting}
              required
              placeholder="0.00"
            />
            <Input
              label="Duración (minutos)"
              name="duration_minutes"
              type="number"
              value={formData.duration_minutes}
              onChange={handleChange}
              disabled={isSubmitting}
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
                disabled={isSubmitting}
                className="service-form-checkbox"
              />
              <span>Activo</span>
            </label>
          </div>

          <FormButtons
            onCancel={onCancel}
            submitLabel={service ? 'Actualizar' : 'Crear'}
            isSubmitting={isSubmitting}
          />
        </form>
      </EntityFormView>

      {/* Modal para crear categoría */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          setNewCategory({ name: '', description: '' });
        }}
        title="Nueva Categoria"
      >
        <form onSubmit={handleSubmitCategory} className="service-form-modal-form">
          <Input
            label="Nombre"
            name="name"
            value={newCategory.name}
            onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
            disabled={isCreatingCategory}
            required
            placeholder="Nombre de la categoria"
          />
          <Textarea
            label="Descripcion"
            name="description"
            value={newCategory.description}
            onChange={(e) => setNewCategory((prev) => ({ ...prev, description: e.target.value }))}
            disabled={isCreatingCategory}
            placeholder="Descripcion de la categoria"
            rows={3}
          />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowCategoryModal(false);
                setNewCategory({ name: '', description: '' });
              }}
              disabled={isCreatingCategory}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreatingCategory}>
              {isCreatingCategory ? 'Creando...' : 'Crear Categoria'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default ServiceForm;











