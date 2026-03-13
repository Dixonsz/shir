import { useState, useEffect } from 'react';
import { categoryServicesApi } from '../category-services/category-services.api';
import { showToast } from '../../providers/ToastProvider';

export const useServiceForm = (service, onCategoryCreated) => {
  const [formData, setFormData] = useState({
    name: '',
    category_service_id: '',
    description: '',
    price: '',
    duration_minutes: '',
    is_active: true,
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        category_service_id: service.category_service_id || '',
        description: service.description || '',
        price: service.price || '',
        duration_minutes: service.duration_minutes || '',
        is_active: service.is_active !== undefined ? service.is_active : true,
      });
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const newCategoryData = await categoryServicesApi.create(newCategory);
      showToast.success('Categoría creada exitosamente');
      setShowCategoryModal(false);
      setNewCategory({ name: '', description: '' });
      if (onCategoryCreated) {
        onCategoryCreated();
      }
      setFormData(prev => ({
        ...prev,
        category_service_id: newCategoryData.id
      }));
    } catch (error) {
      showToast.error('Error al crear categoría');
      console.error('Error creating category:', error);
    }
  };

  return {
    formData,
    setFormData,
    showCategoryModal,
    setShowCategoryModal,
    newCategory,
    setNewCategory,
    handleChange,
    handleCreateCategory,
  };
};
