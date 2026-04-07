import { useState, useEffect } from 'react';

export const useProductForm = (product) => {
  const [formData, setFormData] = useState({
    name: '',
    category_product_id: '',
    description: '',
    price: '',
    stock: '',
    is_active: true,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category_product_id: product.category_product_id || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        is_active: product.is_active !== undefined ? product.is_active : true,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return {
    formData,
    handleChange,
  };
};









