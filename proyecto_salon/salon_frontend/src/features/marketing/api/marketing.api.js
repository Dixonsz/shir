import apiClient from '../../../api/axios';
import { extractData } from '../../../core/api/response';

function buildMarketingFormData(marketingData) {
  const formData = new FormData();

  formData.append('name', marketingData.name);
  if (marketingData.description) formData.append('description', marketingData.description);
  if (marketingData.promotion_id) formData.append('promotion_id', marketingData.promotion_id);
  if (marketingData.start_date && marketingData.start_date !== '') formData.append('start_date', marketingData.start_date);
  if (marketingData.end_date && marketingData.end_date !== '') formData.append('end_date', marketingData.end_date);
  if (marketingData.image) formData.append('image', marketingData.image);

  return formData;
}

export const marketingApi = {
  getAll: async () => {
    const response = await apiClient.get('/marketing');
    return extractData(response);
  },

  getById: async (id) => {
    const response = await apiClient.get(`/marketing/${id}`);
    return extractData(response);
  },

  getActive: async () => {
    const response = await apiClient.get('/marketing/active');
    return extractData(response);
  },

  getByPromotion: async (promotionId) => {
    const response = await apiClient.get(`/marketing/promotion/${promotionId}`);
    return extractData(response);
  },

  createWithImage: async (marketingData) => {
    const formData = buildMarketingFormData(marketingData);
    const response = await apiClient.post('/marketing/with-image', formData);
    return extractData(response);
  },

  create: async (marketingData) => {
    const response = await apiClient.post('/marketing', marketingData);
    return extractData(response);
  },

  update: async (id, marketingData) => {
    const cleanData = {
      name: marketingData.name,
      description: marketingData.description || null,
      promotion_id: marketingData.promotion_id || null,
      start_date: marketingData.start_date && marketingData.start_date !== '' ? marketingData.start_date : null,
      end_date: marketingData.end_date && marketingData.end_date !== '' ? marketingData.end_date : null
    };

    const response = await apiClient.put(`/marketing/${id}`, cleanData);
    return extractData(response);
  },

  updateWithImage: async (id, marketingData) => {
    const formData = buildMarketingFormData(marketingData);
    const response = await apiClient.put(`/marketing/${id}/with-image`, formData);
    return extractData(response);
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/marketing/${id}`);
    return extractData(response);
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return extractData(response);
  },

  deleteImage: async (publicId) => {
    const response = await apiClient.post('/delete', { public_id: publicId });
    return extractData(response);
  },
};







