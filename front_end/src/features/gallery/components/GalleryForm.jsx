import { useState, useEffect } from 'react';
import Input from '../../../components/forms/Input';
import Textarea from '../../../components/forms/Textarea';
import FormButtons from '../../../components/forms/FormButtons';
import EntityFormView from '../../../components/layout/EntityFormView';
import { Upload, X } from 'lucide-react';
import '../GalleryForm.css';

function GalleryForm({ item, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        order: item.order || 0,
      });
      if (item.image_url) {
        setImagePreview(item.image_url);
      }
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        'image/jpeg', 'image/jpg', 'image/pjpeg',
        'image/png', 'image/gif', 'image/webp',
        'image/svg+xml', 'image/svg', 'image/x-svg+xml', 'application/svg+xml',
      ];
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
      const extension = file.name?.split('.').pop()?.toLowerCase() || '';
      const mimeType = (file.type || '').toLowerCase();
      const hasValidMime = mimeType && validTypes.includes(mimeType);
      const hasValidExtension = validExtensions.includes(extension);

      if (!hasValidMime && !hasValidExtension) {
        setError('Por favor selecciona una imagen valida (JPG, PNG, GIF, WEBP, SVG)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no debe superar los 5MB');
        return;
      }
      
      setImageFile(file);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedTitle = (formData.title || '').trim();
    const normalizedOrder =
      formData.order === '' || formData.order === null || formData.order === undefined
        ? '0'
        : String(formData.order);

    if (!normalizedTitle) {
      setError('El titulo es requerido');
      return;
    }
    
    if (!item && !imageFile) {
      setError('Por favor seleccione una imagen');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const submitData = new FormData();
      submitData.append('title', normalizedTitle);
      submitData.append('description', formData.description);
      submitData.append('order', normalizedOrder);
      
      if (imageFile instanceof File) {
        submitData.append('image', imageFile);
      }

      await onSubmit(submitData, item?.id);
    } catch (err) {
      console.error('Error al guardar imagen:', err);
      setError(err.response?.data?.message || 'Error al guardar la imagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <EntityFormView title={item ? 'Editar Imagen' : 'Nueva Imagen'} onBack={onCancel}>
        <form onSubmit={handleSubmit} className="gallery-form">
          {error && (
            <div className="gallery-form-error">
              {error}
            </div>
          )}

          <Input
            label="Título"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Título de la imagen"
          />

          <Textarea
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descripción de la imagen"
            rows={3}
          />

          <Input
            label="Orden"
            name="order"
            type="number"
            value={formData.order}
            onChange={handleChange}
            placeholder="Orden de visualización"
          />

          <div className="gallery-form-group">
            <label className="gallery-form-label">Imagen de la Galería</label>
            
            {imagePreview ? (
              <div className="gallery-form-image-preview">
                <img src={imagePreview} alt="Preview" className="gallery-form-preview-image" />
                <button 
                  type="button" 
                  onClick={handleRemoveImage}
                  className="gallery-form-remove-button"
                >
                  <X size={16} />
                  Quitar imagen
                </button>
              </div>
            ) : (
              <div className="gallery-form-image-upload">
                <input
                  type="file"
                  id="image"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml,.svg"
                  onChange={handleImageChange}
                  className="gallery-form-file-input"
                />
                <label htmlFor="image" className="gallery-form-upload-label">
                  <Upload size={24} />
                  <span>Seleccionar imagen</span>
                </label>
                <p className="gallery-form-help-text">
                  JPG, PNG, GIF, WEBP o SVG. Maximo 5MB
                </p>
              </div>
            )}
          </div>

          <FormButtons
            onCancel={onCancel}
            submitLabel={item ? 'Actualizar' : 'Crear'}
            isSubmitting={loading}
          />
        </form>
    </EntityFormView>
  );
}

export default GalleryForm;











