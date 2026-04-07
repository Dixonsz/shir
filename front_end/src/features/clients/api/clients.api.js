import apiClient from '../../../api/axios';
import { extractData } from '../../../core/api/response';

export const clientsApi = {
  getAll: async ({ page, pageSize } = {}) => {
    const params = {};
    if (page) params.page = page;
    if (pageSize) params.page_size = pageSize;
    const response = await apiClient.get('/clients', { params });
    return response?.data ?? extractData(response);
  },

  getById: async (id) => {
    const response = await apiClient.get(`/clients/${id}`);
    return extractData(response);
  },

  getByNumberId: async (numberId) => {
    const response = await apiClient.get(`/clients/number_id/${numberId}`);
    return response?.data ?? {};
  },

  create: async (clientData) => {
    const response = await apiClient.post('/clients', clientData);
    return extractData(response);
  },

  update: async (id, clientData) => {
    const response = await apiClient.put(`/clients/${id}`, clientData);
    return extractData(response);
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/clients/${id}`);
    return extractData(response);
  },

  uploadPhoto: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(`/clients/${id}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return extractData(response);
  },

  deletePhoto: async (id) => {
    const response = await apiClient.delete(`/clients/${id}/photo`);
    return extractData(response);
  },
};







