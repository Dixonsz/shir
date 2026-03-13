import Button from '../common/Button';
import './FormButtons.css';

function FormButtons({ 
  onCancel, 
  onSubmit, 
  submitLabel = 'Guardar', 
  cancelLabel = 'Cancelar',
  isSubmitting = false,
}) {
  return (
    <div className="form-buttons-container">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        {cancelLabel}
      </Button>
      <Button
        type="submit"
        variant="primary"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Guardando...' : submitLabel}
      </Button>
    </div>
  );
}

export default FormButtons;
