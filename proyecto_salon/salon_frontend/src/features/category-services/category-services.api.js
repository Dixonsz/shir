import apiClient from '../../api/axios';

export const categoryServicesApi = {
  getAll: async () => {
    const response = await apiClient.get('/category-services');
    return response.data.data || response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/category-services/${id}`);
    return response.data.data || response.data;
  },

  create: async (categoryData) => {
    const response = await apiClient.post('/category-services', categoryData);
    return response.data.data || response.data;
  },

  update: async (id, categoryData) => {
    const response = await apiClient.put(`/category-services/${id}`, categoryData);
    return response.data.data || response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/category-services/${id}`);
    return response.data.data || response.data;
  },
};
