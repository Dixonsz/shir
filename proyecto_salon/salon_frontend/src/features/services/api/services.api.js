import apiClient from '../../../api/axios';
import { extractData } from '../../../core/api/response';

export const servicesApi = {
  getAll: async (includePromotions = true, { page, pageSize } = {}) => {
    const params = {};
    if (includePromotions) params.include_promotions = 'true';
    if (page) params.page = page;
    if (pageSize) params.page_size = pageSize;
    const response = await apiClient.get('/services', { params });
    return response?.data ?? extractData(response);
  },

  getById: async (id, includePromotions = true) => {
    const params = includePromotions ? '?include_promotions=true' : '';
    const response = await apiClient.get(`/services/${id}${params}`);
    return extractData(response);
  },

  create: async (serviceData) => {
    const response = await apiClient.post('/services', serviceData);
    return extractData(response);
  },

  update: async (id, serviceData) => {
    const response = await apiClient.put(`/services/${id}`, serviceData);
    return extractData(response);
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/services/${id}`);
    return extractData(response);
  },
};







