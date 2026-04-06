import apiClient from '../../../api/axios';
import { extractData } from '../../../core/api/response';

export const categoryProductsApi = {
  getAll: async ({ page, pageSize } = {}) => {
    const params = {};
    if (page) params.page = page;
    if (pageSize) params.page_size = pageSize;
    const response = await apiClient.get('/category-products', { params });
    if (page || pageSize) {
      return response?.data ?? {};
    }

    return extractData(response);
  },

  getById: async (id) => {
    const response = await apiClient.get(`/category-products/${id}`);
    return extractData(response);
  },

  getForSelect: async () => {
    const response = await apiClient.get('/category-products', {
      params: {
        page: 1,
        page_size: 500,
        order: 'asc',
        order_by: 'name',
      },
    });
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







