import { useState, useEffect } from 'react';
import { promotionsApi } from '../../promotions/api';

export const useMarketingForm = (marketing) => {
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

  return {
    formData,
    imageFile,
    imagePreview,
    promotions,
    loading,
    error,
    setLoading,
    setError,
    handleChange,
    handleImageChange,
    handleRemoveImage,
  };
};









