import { useState, useEffect } from 'react';
import { promotionsApi } from './promotions.api';

export function usePromotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPromotions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await promotionsApi.getAll();
      setPromotions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar promociones');
    } finally {
      setLoading(false);
    }
  };

  const createPromotion = async (promotionData) => {
    try {
      const newPromotion = await promotionsApi.create(promotionData);
      setPromotions((prev) => [...(Array.isArray(prev) ? prev : []), newPromotion]);
      return { success: true, data: newPromotion };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al crear promoción',
      };
    }
  };

  const updatePromotion = async (id, promotionData) => {
    try {
      const updatedPromotion = await promotionsApi.update(id, promotionData);
      setPromotions((prev) =>
        Array.isArray(prev)
          ? prev.map((promotion) =>
              promotion.id === id ? updatedPromotion : promotion
            )
          : []
      );
      return { success: true, data: updatedPromotion };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al actualizar promoción',
      };
    }
  };

  const deletePromotion = async (id) => {
    try {
      await promotionsApi.delete(id);
      setPromotions((prev) =>
        Array.isArray(prev) ? prev.filter((promotion) => promotion.id !== id) : []
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al eliminar promoción',
      };
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  return {
    promotions,
    loading,
    error,
    fetchPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
  };
}
