import { useState, useRef } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import Avatar from './Avatar';
import Button from './Button';
import './PhotoUpload.css';

function PhotoUpload({ 
  currentPhoto, 
  onUpload, 
  onDelete, 
  size = 'large',
  loading = false 
}) {
  const [preview, setPreview] = useState(currentPhoto);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Por favor seleccione un archivo de imagen válido (JPG, PNG, GIF, WEBP)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      if (onUpload) {
        onUpload(file);
      }
    }
  };

  const handleDelete = () => {
    setPreview(null);
    if (onDelete) {
      onDelete();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="photo-upload-container">
      <div className="photo-upload-avatar-wrapper">
        <Avatar 
          src={preview} 
          size={size} 
          onClick={!loading ? handleClick : undefined}
        />
        
        {!loading && (
          <div className="photo-upload-camera-icon" onClick={handleClick}>
            <Camera size={20} />
          </div>
        )}

        {loading && (
          <div className="photo-upload-loading-overlay">
            <div className="photo-upload-spinner">⟳</div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="photo-upload-hidden-input"
        disabled={loading}
      />

      <div className="photo-upload-buttons">
        <Button
          type="button"
          onClick={handleClick}
          variant="secondary"
          disabled={loading}
        >
          <Upload size={16} />
          {preview ? 'Cambiar Foto' : 'Subir Foto'}
        </Button>

        {preview && (
          <Button
            type="button"
            onClick={handleDelete}
            variant="danger"
            disabled={loading}
          >
            <X size={16} />
            Eliminar
          </Button>
        )}
      </div>

      <p className="photo-upload-hint">
        Formatos: JPG, PNG, GIF, WEBP (máx. 5MB)
      </p>
    </div>
  );
}

export default PhotoUpload;
