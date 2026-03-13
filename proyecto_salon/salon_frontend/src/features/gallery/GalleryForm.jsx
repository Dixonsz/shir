import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/forms/Input';
import Textarea from '../../components/forms/Textarea';
import FormButtons from '../../components/forms/FormButtons';
import { ArrowLeft, Upload, X } from 'lucide-react';

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
    
    if (!item && !imageFile) {
      setError('Por favor seleccione una imagen');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('order', formData.order);
      
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
    <div>
      <div style={styles.header}>
        <Button onClick={onCancel} variant="secondary">
          <ArrowLeft size={20} />
          Volver
        </Button>
        <h1 style={styles.title}>
          {item ? 'Editar Imagen' : 'Nueva Imagen'}
        </h1>
        <div style={{ width: '100px' }}></div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.error}>
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

          <div style={styles.formGroup}>
            <label style={styles.label}>Imagen de la Galería</label>
            
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
            submitText={item ? 'Actualizar' : 'Crear'}
            loading={loading}
          />
        </form>
      </Card>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    margin: 0,
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#e2e8f0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  error: {
    padding: '1rem',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    color: '#ef4444',
    fontSize: '0.875rem',
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
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
    opacity: 0,
    pointerEvents: 'none',
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
    flexDirection: 'column',
    gap: '0.5rem',
  },
  previewContainer: {
    marginTop: '1rem',
    maxWidth: '400px',
  },
  preview: {
    width: '100%',
    height: 'auto',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
  },
};

export default GalleryForm;
