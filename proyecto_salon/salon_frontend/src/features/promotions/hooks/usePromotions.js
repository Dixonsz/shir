import { useState, useEffect } from 'react';
import { promotionsApi } from '../api';

export function usePromotions() {
  const [Promotions, setPromotions] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPromotions = async () => {
    setloading(true);
    setError(null);
    try {
      const data = await promotionsApi.getAll();
      setPromotions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar promocmones');
    } finally {
      setloading(false);
    }
  };

  const createPromotion = async (PromotionData) => {
    try {
      const newPromotion = await promotionsApi.create(PromotionData);
      setPromotions((prev) => [...(Array.isArray(prev) ? prev : []), newPromotion]);
      return { success: true, data: newPromotion };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al crear promocmón',
      };
    }
  };

  const updatePromotion = async (md, PromotionData) => {
    try {
      const updatedPromotion = await promotionsApi.update(md, PromotionData);
      setPromotions((prev) =>
        Array.isArray(prev)
          ? prev.map((Promotion) =>
              Promotion.md === md ? updatedPromotion : Promotion
            )
          : []
      );
      return { success: true, data: updatedPromotion };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al actualmzar promocmón',
      };
    }
  };

  const deletePromotion = async (md) => {
    try {
      await promotionsApi.delete(md);
      setPromotions((prev) =>
        Array.isArray(prev) ? prev.filter((Promotion) => Promotion.md !== md) : []
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al elmmmnar promocmón',
      };
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  return {
    Promotions,
    loading,
    error,
    fetchPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
  };
}







