import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/forms/Input';
import Textarea from '../../components/forms/Textarea';
import FormButtons from '../../components/forms/FormButtons';
import { ArrowLeft } from 'lucide-react';
import { useAdditionalForm } from './AdditionalForm.logic';
import './AdditionalForm.css';

function AdditionalForm({ additional, onSubmit, onCancel }) {
  const { formData, handleChange, handleSubmit } = useAdditionalForm(additional);

  return (
    <div>
      <div className="additional-form-header">
        <Button onClick={onCancel} variant="secondary">
          <ArrowLeft size={20} />
          Volver
        </Button>
        <h1 className="additional-form-title">
          {additional ? 'Editar Adicional' : 'Nuevo Adicional'}
        </h1>
        <div className="additional-form-spacer"></div>
      </div>

      <Card>
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
      </Card>
    </div>
  );
}

export default AdditionalForm;
