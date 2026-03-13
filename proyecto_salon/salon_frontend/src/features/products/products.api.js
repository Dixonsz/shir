import apiClient from '../../api/axios';

export const productsApi = {
  getAll: async () => {
    const response = await apiClient.get('/products');
    return response.data.data || response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data.data || response.data;
  },

  create: async (productData) => {
    const response = await apiClient.post('/products', productData);
    return response.data.data || response.data;
  },

  update: async (id, productData) => {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data.data || response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data.data || response.data;
  },
};
