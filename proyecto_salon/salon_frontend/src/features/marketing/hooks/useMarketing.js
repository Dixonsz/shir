import { useState, useEffect } from 'react';
import { marketingApi } from '../api';

export const useMarketing = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await marketingApi.getAll();
      setCampaigns(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar campañas');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const createCampaign = async (campaignData) => {
    try {
      await marketingApi.createWithImage(campaignData);
      await loadCampaigns();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al crear campaña',
      };
    }
  };

  const updateCampaign = async (id, campaignData) => {
    try {
      if (campaignData.image && campaignData.image instanceof File) {
        await marketingApi.updateWithImage(id, campaignData);
      } else {
        const { image, ...dataWithoutImage } = campaignData;
        await marketingApi.update(id, dataWithoutImage);
      }
      await loadCampaigns();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al actualizar campaña',
      };
    }
  };

  const deleteCampaign = async (id) => {
    try {
      await marketingApi.delete(id);
      await loadCampaigns();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al eliminar campaña',
      };
    }
  };

  return {
    campaigns,
    loading,
    error,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    refreshCampaigns: loadCampaigns,
  };
};







