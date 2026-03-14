import apiClient from '../../../api/axios';
import { extractData } from '../../../core/api/response';

export const additionalsApi = {
  getAll: async () => {
    const response = await apiClient.get('/additionals');
    return extractData(response);
  },

  getById: async (id) => {
    const response = await apiClient.get(`/additionals/${id}`);
    return extractData(response);
  },

  create: async (additionalData) => {
    const response = await apiClient.post('/additionals', additionalData);
    return extractData(response);
  },

  update: async (id, additionalData) => {
    const response = await apiClient.put(`/additionals/${id}`, additionalData);
    return extractData(response);
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/additionals/${id}`);
    return extractData(response);
  },
};







