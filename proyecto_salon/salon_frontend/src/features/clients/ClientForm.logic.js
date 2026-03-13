import { useState, useEffect } from 'react';
import { clientsApi } from './clients.api';
import { showToast } from '../../providers/ToastProvider';

export const useClientForm = (client) => {
  const [formData, setFormData] = useState({
    number_id: '',
    name: '',
    email: '',
    phone_number: '',
    is_active: true,
  });
  const [photoUploading, setPhotoUploading] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(null);

  useEffect(() => {
    if (client) {
      setFormData({
        number_id: client.number_id || '',
        name: client.name || '',
        email: client.email || '',
        phone_number: client.phone_number || '',
        is_active: client.is_active ?? true,
      });
      setCurrentPhoto(client.photo_url || null);
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePhotoUpload = async (file) => {
    if (!client || !client.id) {
      showToast.warning('Debe guardar el cliente antes de subir una foto');
      return;
    }

    setPhotoUploading(true);
    try {
      const result = await clientsApi.uploadPhoto(client.id, file);
      setCurrentPhoto(result.photo_url);
      showToast.success('Foto subida exitosamente');
    } catch (error) {
      showToast.error('Error al subir la foto');
      console.error('Error uploading photo:', error);
    } finally {
      setPhotoUploading(false);
    }
  };

  const handlePhotoDelete = async () => {
    if (!client || !client.id) {
      return;
    }

    setPhotoUploading(true);
    try {
      await clientsApi.deletePhoto(client.id);
      setCurrentPhoto(null);
      showToast.success('Foto eliminada exitosamente');
    } catch (error) {
      showToast.error('Error al eliminar la foto');
      console.error('Error deleting photo:', error);
    } finally {
      setPhotoUploading(false);
    }
  };

  return {
    formData,
    photoUploading,
    currentPhoto,
    handleChange,
    handlePhotoUpload,
    handlePhotoDelete,
  };
};
