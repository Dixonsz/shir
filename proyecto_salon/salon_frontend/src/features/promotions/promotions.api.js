import apiClient from '../../api/axios';

export const promotionsApi = {
  getAll: async () => {
    const response = await apiClient.get('/promotions');
    return response.data.data || response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/promotions/${id}`);
    return response.data.data || response.data;
  },

  create: async (promotionData) => {
    const response = await apiClient.post('/promotions', promotionData);
    return response.data.data || response.data;
  },

  update: async (id, promotionData) => {
    const response = await apiClient.put(`/promotions/${id}`, promotionData);
    return response.data.data || response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/promotions/${id}`);
    return response.data;
  },
};
