import Input from '../../../components/forms/Input';
import Textarea from '../../../components/forms/Textarea';
import FormButtons from '../../../components/forms/FormButtons';
import EntityFormView from '../../../components/layout/EntityFormView';
import { useAdditionalForm } from '../logic/AdditionalForm.logic';
import '../AdditionalForm.css';

function AdditionalForm({ additional, onSubmit, onCancel }) {
  const { formData, handleChange, handleSubmit } = useAdditionalForm(additional);

  return (
    <EntityFormView title={additional ? 'Editar Adicional' : 'Nuevo Adicional'} onBack={onCancel}>
        <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="additional-form">
          <Textarea
            label="Concepto"
            name="concept"
            value={formData.concept}
            onChange={handleChange}
            required
            placeholder="Descripción del adicional"
            rows={3}
          />

          <div className="additional-form-row">
            <Input
              label="Precio"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="0.00"
            />
            <Input
              label="ID Cita (opcional)"
              name="appointment_id"
              type="number"
              value={formData.appointment_id}
              onChange={handleChange}
              placeholder="Dejar vacío si no está asignado"
            />
          </div>

          <FormButtons
            onCancel={onCancel}
            submitLabel={additional ? 'Actualizar' : 'Crear'}
          />
        </form>
    </EntityFormView>
  );
}

export default AdditionalForm;











