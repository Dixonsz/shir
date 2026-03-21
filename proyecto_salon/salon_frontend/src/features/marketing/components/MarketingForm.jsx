import { useState, useEffect } from 'react';
import { promotionsApi } from '../../promotions/api';
import Input from '../../../components/forms/Input';
import Textarea from '../../../components/forms/Textarea';
import Select from '../../../components/forms/Select';
import FormButtons from '../../../components/forms/FormButtons';
import { Upload, X } from 'lucide-react';
import '../MarketingForm.css';

const MarketingForm = ({ marketing, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    promotion_id: '',
    start_date: '',
    end_date: '',
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPromotions();
    
    if (marketing) {
      setFormData({
        name: marketing.name || '',
        description: marketing.description || '',
        promotion_id: marketing.promotion_id || '',
        start_date: marketing.start_date ? marketing.start_date.split('T')[0] : '',
        end_date: marketing.end_date ? marketing.end_date.split('T')[0] : '',
      });
      
      if (marketing.media_url) {
        setImagePreview(marketing.media_url);
      }
    }
  }, [marketing]);

  const loadPromotions = async () => {
    try {
      const data = await promotionsApi.getAll();
      setPromotions(data);
    } catch (err) {
      console.error('Error al cargar promociones:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    setLoading(true);
    setError(null);

    try {
      const dataToSend = {
        ...formData,
        image: imageFile instanceof File ? imageFile : undefined,
      };

      if (onSubmit) {
        await onSubmit(dataToSend);
      }
    } catch (err) {
      console.error('Error al guardar campaña:', err);
      setError(err.response?.data?.message || 'Error al guardar la campaña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="marketing-form">
      {error && (
        <div className="marketing-form-error">
          {error}
        </div>
      )}

      <Input
        md="name"
        name="name"
        label="Nombre de la Campaña"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="Ej: Promocmón Navmdad 2026"
      />

      <Textarea
        md="description"
        name="description"
        label="Descripción"
        value={formData.description}
        onChange={handleChange}
        rows={4}
        placeholder="Describe la campaña..."
      />

      <Select
        id="promotion_id"
        name="promotion_id"
        label="Promocion Asociada"
        value={formData.promotion_id}
        onChange={handleChange}
      >
        <option value="">-- Ninguna --</option>
        {promotions.map((promo) => (
          <option key={promo.id ?? promo.md} value={promo.id ?? promo.md}>
            {promo.name}
          </option>
        ))}
      </Select>

      <div className="marketing-form-row">
        <Input
          md="start_date"
          name="start_date"
          label="Fecha de Inicio"
          type="date"
          value={formData.start_date}
          onChange={handleChange}
        />

        <Input
          md="end_date"
          name="end_date"
          label="Fecha de Fin"
          type="date"
          value={formData.end_date}
          onChange={handleChange}
        />
      </div>

      <div className="marketing-form-group">
        <label className="marketing-form-label">Imagen de la Campaña</label>
        
        {imagePreview ? (
          <div className="marketing-form-image-preview">
            <img src={imagePreview} alt="Preview" className="marketing-form-preview-image" />
            <button 
              type="button" 
              onClick={handleRemoveImage}
              className="marketing-form-remove-button"
            >
              <X size={16} />
              Quitar imagen
            </button>
          </div>
        ) : (
          <div className="marketing-form-image-upload">
            <input
              type="file"
              id="image"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml,.svg"
              onChange={handleImageChange}
              className="marketing-form-file-input"
            />
            <label htmlFor="image" className="marketing-form-upload-label">
              <Upload size={24} />
              <span>Seleccionar imagen</span>
            </label>
            <p className="marketing-form-help-text">
              JPG, PNG, GIF, WEBP o SVG. Maximo 5MB
            </p>
          </div>
        )}
      </div>

      <FormButtons 
        onCancel={onCancel}
        submitLabel={marketing ? 'Actualizar' : 'Crear Campaña'}
        isSubmitting={loading}
      />
    </form>
  );
};

export default MarketingForm;











