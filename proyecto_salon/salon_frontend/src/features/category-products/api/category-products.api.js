import apiClient from '../../../api/axios';
import { extractData } from '../../../core/api/response';

export const categoryProductsApi = {
  getAll: async () => {
    const response = await apiClient.get('/category-products');
    return extractData(response);
  },

  getById: async (id) => {
    const response = await apiClient.get(`/category-products/${id}`);
    return extractData(response);
  },

  create: async (categoryData) => {
    const response = await apiClient.post('/category-products', categoryData);
    return extractData(response);
  },

  update: async (id, categoryData) => {
    const response = await apiClient.put(`/category-products/${id}`, categoryData);
    return extractData(response);
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/category-products/${id}`);
    return extractData(response);
  },
};







