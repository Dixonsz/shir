import apiClient from '../../../api/axios';
import { extractData } from '../../../core/api/response';

export const rolesApi = {
  getAll: async () => {
    const response = await apiClient.get('/roles');
    return extractData(response);
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







