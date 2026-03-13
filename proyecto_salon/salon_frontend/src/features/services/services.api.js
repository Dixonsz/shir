import apiClient from '../../api/axios';

export const servicesApi = {
  getAll: async (includePromotions = true) => {
    const params = includePromotions ? '?include_promotions=true' : '';
    const response = await apiClient.get(`/services${params}`);
    return response.data.data || response.data;
  },

  getById: async (id, includePromotions = true) => {
    const params = includePromotions ? '?include_promotions=true' : '';
    const response = await apiClient.get(`/services/${id}${params}`);
    return response.data.data || response.data;
  },

  create: async (serviceData) => {
    const response = await apiClient.post('/services', serviceData);
    return response.data.data || response.data;
  },

  update: async (id, serviceData) => {
    const response = await apiClient.put(`/services/${id}`, serviceData);
    return response.data.data || response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/services/${id}`);
    return response.data.data || response.data;
  },
};
