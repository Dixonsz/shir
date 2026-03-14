import apiClient from '../../../api/axios';
import { extractData } from '../../../core/api/response';

export const membersApi = {
  getAll: async () => {
    const response = await apiClient.get('/members');
    return extractData(response);
  },

  getById: async (id) => {
    const response = await apiClient.get(`/members/${id}`);
    return extractData(response);
  },

  create: async (memberData) => {
    const response = await apiClient.post('/members', memberData);
    return extractData(response);
  },

  update: async (id, memberData) => {
    const response = await apiClient.put(`/members/${id}`, memberData);
    return extractData(response);
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/members/${id}`);
    return extractData(response);
  },

  uploadPhoto: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(`/members/${id}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return extractData(response);
  },

  deletePhoto: async (id) => {
    const response = await apiClient.delete(`/members/${id}/photo`);
    return extractData(response);
  },
};







