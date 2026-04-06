import apiClient from '../../../api/axios';
import { extractData } from '../../../core/api/response';

export const productsApi = {
  getAll: async ({ page, pageSize } = {}) => {
    const params = {};
    if (page) params.page = page;
    if (pageSize) params.page_size = pageSize;
    const response = await apiClient.get('/products', { params });
    if (page || pageSize) {
      return response?.data ?? {};
    }

    return extractData(response);
  },

  getById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return extractData(response);
  },

  create: async (productData) => {
    const response = await apiClient.post('/products', productData);
    return extractData(response);
  },

  update: async (id, productData) => {
    const response = await apiClient.put(`/products/${id}`, productData);
    return extractData(response);
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return extractData(response);
  },
};







