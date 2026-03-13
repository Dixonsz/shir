import apiClient from '../../api/axios';

export const additionalsApi = {
  getAll: async () => {
    const response = await apiClient.get('/additionals');
    return response.data.data || response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/additionals/${id}`);
    return response.data.data || response.data;
  },

  create: async (additionalData) => {
    const response = await apiClient.post('/additionals', additionalData);
    return response.data.data || response.data;
  },

  update: async (id, additionalData) => {
    const response = await apiClient.put(`/additionals/${id}`, additionalData);
    return response.data.data || response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/additionals/${id}`);
    return response.data;
  },
};
