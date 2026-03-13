import apiClient from '../../api/axios';

export const categoryProductsApi = {
  getAll: async () => {
    const response = await apiClient.get('/category-products');
    return response.data.data || response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/category-products/${id}`);
    return response.data.data || response.data;
  },

  create: async (categoryData) => {
    const response = await apiClient.post('/category-products', categoryData);
    return response.data.data || response.data;
  },

  update: async (id, categoryData) => {
    const response = await apiClient.put(`/category-products/${id}`, categoryData);
    return response.data.data || response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/category-products/${id}`);
    return response.data.data || response.data;
  },
};
