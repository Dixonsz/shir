import { useState, useEffect } from 'react';
import { promotionsApi } from '../promotions/promotions.api';
import Input from '../../components/forms/Input';
import Textarea from '../../components/forms/Textarea';
import Select from '../../components/forms/Select';
import FormButtons from '../../components/forms/FormButtons';
import { Upload, X } from 'lucide-react';

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
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Por favor selecciona una imagen válida (JPG, PNG, GIF, WEBP)');
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
        image: imageFile instanceof File ? imageFile : undefined
      };

      console.log('=== DEBUG: Enviando campaña ===');
      console.log('Modo:', marketing ? 'EDICIÓN' : 'CREACIÓN');
      console.log('FormData:', formData);
      console.log('ImageFile:', imageFile);
      console.log('Tiene nueva imagen:', imageFile instanceof File);
      console.log('ImagePreview (URL o DataURL):', imagePreview?.substring(0, 50) + '...');

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
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>
        {marketing ? 'Editar Campaña' : 'Nueva Campaña de Marketing'}
      </h2>
      
      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      <Input
        id="name"
        name="name"
        label="Nombre de la Campaña"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="Ej: Promoción Navidad 2026"
      />

      <Textarea
        id="description"
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
        label="Promoción Asociada"
        value={formData.promotion_id}
        onChange={handleChange}
      >
        <option value="">-- Ninguna --</option>
        {promotions.map(promo => (
          <option key={promo.id} value={promo.id}>
            {promo.name} ({promo.discount}% descuento)
          </option>
        ))}
      </Select>

      <div style={styles.formRow}>
        <Input
          id="start_date"
          name="start_date"
          label="Fecha de Inicio"
          type="date"
          value={formData.start_date}
          onChange={handleChange}
        />

        <Input
          id="end_date"
          name="end_date"
          label="Fecha de Fin"
          type="date"
          value={formData.end_date}
          onChange={handleChange}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Imagen de la Campaña</label>
        
        {imagePreview ? (
          <div style={styles.imagePreview}>
            <img src={imagePreview} alt="Preview" style={styles.previewImage} />
            <button 
              type="button" 
              onClick={handleRemoveImage}
              style={styles.removeButton}
            >
              <X size={16} />
              Quitar imagen
            </button>
          </div>
        ) : (
          <div style={styles.imageUpload}>
            <input
              type="file"
              id="image"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleImageChange}
              style={styles.fileInput}
            />
            <label htmlFor="image" style={styles.uploadLabel}>
              <Upload size={24} />
              <span>Seleccionar imagen</span>
            </label>
            <p style={styles.helpText}>
              JPG, PNG, GIF o WEBP. Máximo 5MB
            </p>
          </div>
        )}
      </div>

      <FormButtons 
        onCancel={onCancel}
        submitText={marketing ? 'Actualizar' : 'Crear Campaña'}
        loading={loading}
      />
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: '0.5rem',
  },
  error: {
    padding: '1rem',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    color: '#ef4444',
    fontSize: '0.875rem',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: '0.5rem',
  },
  imagePreview: {
    position: 'relative',
    width: '100%',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    border: '2px solid rgba(71, 85, 105, 0.3)',
  },
  previewImage: {
    width: '100%',
    height: 'auto',
    maxHeight: '300px',
    objectFit: 'cover',
    display: 'block',
  },
  removeButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  imageUpload: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '2rem',
    border: '2px dashed rgba(71, 85, 105, 0.5)',
    borderRadius: '12px',
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
    transition: 'all 0.2s',
  },
  fileInput: {
    display: 'none',
  },
  uploadLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    backgroundColor: 'rgba(238, 43, 140, 0.1)',
    color: '#ee2b8c',
    border: '2px solid rgba(238, 43, 140, 0.3)',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  helpText: {
    fontSize: '0.75rem',
    color: '#64748b',
    margin: 0,
  },
};

export default MarketingForm;
