import apiClient from '../../api/axios';

export const clientsApi = {
  getAll: async () => {
    const response = await apiClient.get('/clients');
    return response.data.data || response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/clients/${id}`);
    return response.data.data || response.data;
  },

  create: async (clientData) => {
    const response = await apiClient.post('/clients', clientData);
    return response.data.data || response.data;
  },

  update: async (id, clientData) => {
    const response = await apiClient.put(`/clients/${id}`, clientData);
    return response.data.data || response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/clients/${id}`);
    return response.data;
  },

  uploadPhoto: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(`/clients/${id}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data || response.data;
  },

  deletePhoto: async (id) => {
    const response = await apiClient.delete(`/clients/${id}/photo`);
    return response.data;
  },
};
