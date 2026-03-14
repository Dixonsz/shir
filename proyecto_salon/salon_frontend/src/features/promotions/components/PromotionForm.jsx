import Input from '../../../components/forms/Input';
import Textarea from '../../../components/forms/Textarea';
import FormButtons from '../../../components/forms/FormButtons';
import EntityFormView from '../../../components/layout/EntityFormView';
import { usePromotionForm } from '../logic/PromotionForm.logic';
import '../PromotionForm.css';

function PromotionForm({ promotion, onSubmit, onCancel }) {
  const { formData, handleChange, prepareSubmitData } = usePromotionForm(promotion);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = prepareSubmitData();
    onSubmit(submitData);
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
              required
              placeholder="Nombre de la promoción"
            />
            <div className="promotion-form-select-container">
              <label className="promotion-form-label">Tipo de Descuento</label>
              <select
                name="discount_type"
                value={formData.discount_type}
                onChange={handleChange}
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
              required
            />
            <Input
              label="Fecha de Fin"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
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
                className="promotion-form-checkbox"
              />
              <span>Activo</span>
            </label>
          </div>

          <FormButtons
            onCancel={onCancel}
            submitLabel={promotion ? 'Actualizar' : 'Crear'}
          />
        </form>
    </EntityFormView>
  );
}

export default PromotionForm;











