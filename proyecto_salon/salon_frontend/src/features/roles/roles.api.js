import apiClient from '../../api/axios';

export const rolesApi = {
  getAll: async () => {
    const response = await apiClient.get('/roles');
    return response.data.data || response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/roles/${id}`);
    return response.data.data || response.data;
  },

  create: async (roleData) => {
    const response = await apiClient.post('/roles', roleData);
    return response.data.data || response.data;
  },

  update: async (id, roleData) => {
    const response = await apiClient.put(`/roles/${id}`, roleData);
    return response.data.data || response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/roles/${id}`);
    return response.data.data || response.data;
  },
};
