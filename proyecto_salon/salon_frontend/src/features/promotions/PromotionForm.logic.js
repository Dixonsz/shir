import { useState, useEffect } from 'react';

export const usePromotionForm = (promotion) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discount_type: 'porcentual',
    discount_value: '',
    start_date: '',
    end_date: '',
    is_active: true,
  });

  useEffect(() => {
    if (promotion) {
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        name: promotion.name || '',
        description: promotion.description || '',
        discount_type: promotion.discount_type || 'porcentual',
        discount_value: promotion.discount_value || '',
        start_date: formatDateForInput(promotion.start_date),
        end_date: formatDateForInput(promotion.end_date),
        is_active: promotion.is_active ?? true,
      });
    }
  }, [promotion]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const prepareSubmitData = () => {
    return {
      ...formData,
      start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
    };
  };

  return {
    formData,
    handleChange,
    prepareSubmitData,
  };
};
