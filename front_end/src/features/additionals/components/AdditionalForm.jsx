import Input from '../../../components/forms/Input';
import Textarea from '../../../components/forms/Textarea';
import FormButtons from '../../../components/forms/FormButtons';
import EntityFormView from '../../../components/layout/EntityFormView';
import { useMutationLock } from '../../../hooks/useMutationLock';
import { useAdditionalForm } from '../logic/AdditionalForm.logic';
import '../AdditionalForm.css';

function AdditionalForm({ additional, onSubmit, onCancel }) {
  const { formData, handleChange, handleSubmit } = useAdditionalForm(additional);
  const { isLocked: isSubmitting, runWithLock } = useMutationLock();

  const handleSubmitForm = async (e) => {
    await runWithLock(async () => {
      await handleSubmit(e, onSubmit);
    });
  };

  return (
    <EntityFormView title={additional ? 'Editar Adicional' : 'Nuevo Adicional'} onBack={onCancel}>
        <form onSubmit={handleSubmitForm} className="additional-form">
          <Textarea
            label="Concepto"
            name="concept"
            value={formData.concept}
            onChange={handleChange}
            disabled={isSubmitting}
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
              disabled={isSubmitting}
              required
              placeholder="0.00"
            />
            <Input
              label="ID Cita (opcional)"
              name="appointment_id"
              type="number"
              value={formData.appointment_id}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Dejar vacío si no está asignado"
            />
          </div>

          <FormButtons
            onCancel={onCancel}
            submitLabel={additional ? 'Actualizar' : 'Crear'}
            isSubmitting={isSubmitting}
          />
        </form>
    </EntityFormView>
  );
}

export default AdditionalForm;











