import apiClient from '../../../api/axios';
import { extractData } from '../../../core/api/response';

export const rolesApi = {
  getAll: async ({ page, pageSize } = {}) => {
    const params = {};
    if (page) params.page = page;
    if (pageSize) params.page_size = pageSize;
    const response = await apiClient.get('/roles', { params });
    return response?.data ?? extractData(response);
  },

  getById: async (id) => {
    const response = await apiClient.get(`/roles/${id}`);
    return extractData(response);
  },

  create: async (roleData) => {
    const response = await apiClient.post('/roles', roleData);
    return extractData(response);
  },

  update: async (id, roleData) => {
    const response = await apiClient.put(`/roles/${id}`, roleData);
    return extractData(response);
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/roles/${id}`);
    return extractData(response);
  },
};







