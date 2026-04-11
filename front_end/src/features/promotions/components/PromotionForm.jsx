import { useEffect, useState } from 'react';
import Input from '../../../components/forms/Input';
import Textarea from '../../../components/forms/Textarea';
import FormButtons from '../../../components/forms/FormButtons';
import EntityFormView from '../../../components/layout/EntityFormView';
import { useMutationLock } from '../../../hooks/useMutationLock';
import { servicesApi } from '../../services/api';
import { showToast } from '../../../providers/ToastProvider';
import { usePromotionForm } from '../logic/PromotionForm.logic';
import '../PromotionForm.css';

function PromotionForm({ promotion, onSubmit, onCancel }) {
  const { formData, handleChange, prepareSubmitData, toggleService } = usePromotionForm(promotion);
  const [services, setServices] = useState([]);
  const { isLocked: isSubmitting, runWithLock } = useMutationLock();

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await servicesApi.getAll(false);
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading services in promotion form:', error);
        showToast.error('No fue posible cargar los servicios para la promocion.');
      }
    };

    loadServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = prepareSubmitData();
    await runWithLock(async () => {
      await onSubmit(submitData);
    });
  };

  return (
    <EntityFormView title={promotion ? 'Editar Promoción' : 'Nueva Promoción'} onBack={onCancel}>
        <form onSubmit={handleSubmit} className="promotion-form">
          <div className="promotion-form-row">
            <Input
              label="Nombre"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              placeholder="Nombre de la promoción"
            />
            <div className="promotion-form-select-container">
              <label className="promotion-form-label">Tipo de Descuento</label>
              <select
                name="discount_type"
                value={formData.discount_type}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                className="promotion-form-select"
              >
                <option value="porcentual">Porcentual (%)</option>
                <option value="fijo">Fijo ($)</option>
              </select>
            </div>
          </div>

          <Textarea
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Descripción de la promoción"
            rows={3}
          />

          <div className="promotion-form-row">
            <Input
              label={formData.discount_type === 'porcentual' ? 'Descuento (%)' : 'Descuento ($)'}
              name="discount_value"
              type="number"
              step={formData.discount_type === 'porcentual' ? '1' : '0.01'}
              min="0"
              max={formData.discount_type === 'porcentual' ? '100' : undefined}
              value={formData.discount_value}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              placeholder={formData.discount_type === 'porcentual' ? '0-100' : '0.00'}
            />
          </div>

          <div className="promotion-form-row">
            <Input
              label="Fecha de Inicio"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
            <Input
              label="Fecha de Fin"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="promotion-form-checkbox-container">
            <label className="promotion-form-checkbox-label">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                disabled={isSubmitting}
                className="promotion-form-checkbox"
              />
              <span>Activo</span>
            </label>
          </div>

          <div className="promotion-form-services-container">
            <label className="promotion-form-label">Servicios Asociados</label>
            <div className="promotion-form-services-grid">
              {services.map((service) => {
                const isSelected = formData.service_ids.includes(service.id);
                return (
                  <button
                    key={service.id}
                    type="button"
                    className={`promotion-service-chip ${isSelected ? 'promotion-service-chip-active' : ''}`}
                    onClick={() => toggleService(service.id)}
                    disabled={isSubmitting}
                  >
                    {service.name}
                  </button>
                );
              })}
            </div>
            <p className="promotion-form-helper-text">
              Selecciona uno o varios servicios para que esta promocion se pueda aplicar.
            </p>
          </div>

          <FormButtons
            onCancel={onCancel}
            submitLabel={promotion ? 'Actualizar' : 'Crear'}
            isSubmitting={isSubmitting}
          />
        </form>
    </EntityFormView>
  );
}

export default PromotionForm;











