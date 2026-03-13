import apiClient from '../../api/axios';

export const membersApi = {
  getAll: async () => {
    const response = await apiClient.get('/members');
    return response.data.data || response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/members/${id}`);
    return response.data.data || response.data;
  },

  create: async (memberData) => {
    const response = await apiClient.post('/members', memberData);
    return response.data.data || response.data;
  },

  update: async (id, memberData) => {
    const response = await apiClient.put(`/members/${id}`, memberData);
    return response.data.data || response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/members/${id}`);
    return response.data.data || response.data;
  },

  uploadPhoto: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(`/members/${id}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data || response.data;
  },

  deletePhoto: async (id) => {
    const response = await apiClient.delete(`/members/${id}/photo`);
    return response.data;
  },
};
