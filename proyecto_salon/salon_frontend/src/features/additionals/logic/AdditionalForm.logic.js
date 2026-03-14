import { useState, useEffect } from 'react';

export const useAdditionalForm = (additional) => {
  const [formData, setFormData] = useState({
    concept: '',
    price: '',
    appointment_id: '',
  });

  useEffect(() => {
    if (additional) {
      setFormData({
        concept: additional.concept || '',
        price: additional.price || '',
        appointment_id: additional.appointment_id || '',
      });
    }
  }, [additional]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e, onSubmit) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return {
    formData,
    handleChange,
    handleSubmit,
  };
};









