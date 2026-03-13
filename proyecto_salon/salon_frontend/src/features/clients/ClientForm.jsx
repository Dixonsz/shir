import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/forms/Input';
import FormButtons from '../../components/forms/FormButtons';
import PhotoUpload from '../../components/common/PhotoUpload';
import { ArrowLeft } from 'lucide-react';
import { useClientForm } from './ClientForm.logic';
import './ClientForm.css';

function ClientForm({ client, onSubmit, onCancel }) {
  const {
    formData,
    photoUploading,
    currentPhoto,
    handleChange,
    handlePhotoUpload,
    handlePhotoDelete,
  } = useClientForm(client);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
      <div className="client-form-header">
        <Button onClick={onCancel} variant="secondary">
          <ArrowLeft size={20} />
          Volver
        </Button>
        <h1 className="client-form-title">
          {client ? 'Editar Cliente' : 'Nuevo Cliente'}
        </h1>
        <div style={{ width: '100px' }}></div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="client-form">
          {/* Sección de Foto - Solo mostrar al editar */}
          {client && (
            <div className="client-form-photo-section">
              <h3 className="client-form-section-title">Foto de Perfil</h3>
              <PhotoUpload
                currentPhoto={currentPhoto}
                onUpload={handlePhotoUpload}
                onDelete={handlePhotoDelete}
                loading={photoUploading}
                size="large"
              />
            </div>
          )}

          <div className="client-form-row">
            <Input
              label="Número de Identificación"
              name="number_id"
              value={formData.number_id}
              onChange={handleChange}
              required
              placeholder="Ej: 1-2345-6789"
            />
            <Input
              label="Nombre Completo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Nombre del cliente"
            />
          </div>

          <div className="client-form-row">
            <Input
              label="Correo Electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="correo@ejemplo.com"
            />
            <Input
              label="Teléfono"
              name="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Ej: 8888-8888"
            />
          </div>

          <div className="client-form-checkbox-container">
            <label className="client-form-checkbox-label">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="client-form-checkbox"
              />
              <span>Activo</span>
            </label>
          </div>

          <FormButtons
            onCancel={onCancel}
            submitLabel={client ? 'Actualizar' : 'Crear'}
          />
        </form>
      </Card>
    </div>
  );
}

export default ClientForm;
