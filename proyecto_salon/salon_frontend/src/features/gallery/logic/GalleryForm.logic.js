import { useState, useEffect } from 'react';

export const useGalleryForm = (item) => {
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

  return {
    formData,
    imageFile,
    imagePreview,
    error,
    loading,
    setError,
    setLoading,
    handleChange,
    handleImageChange,
    handleRemoveImage,
  };
};









