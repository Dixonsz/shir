import apiClient from '../../../api/axios';
import { extractData } from '../../../core/api/response';

export const categoryServicesApi = {
  getAll: async ({ page, pageSize } = {}) => {
    const params = {};
    if (page) params.page = page;
    if (pageSize) params.page_size = pageSize;
    const response = await apiClient.get('/category-services', { params });
    return response?.data ?? extractData(response);
  },

  getById: async (id) => {
    const response = await apiClient.get(`/category-services/${id}`);
    return extractData(response);
  },

  create: async (categoryData) => {
    const response = await apiClient.post('/category-services', categoryData);
    return extractData(response);
  },

  update: async (id, categoryData) => {
    const response = await apiClient.put(`/category-services/${id}`, categoryData);
    return extractData(response);
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/category-services/${id}`);
    return extractData(response);
  },
};







