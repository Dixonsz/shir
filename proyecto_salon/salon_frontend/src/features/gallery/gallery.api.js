import apiClient from '../../api/axios';

export const galleryApi = {
  getAll: async () => {
    const response = await apiClient.get('/gallery');
    return response.data.data || response.data;
  },

  getAllAdmin: async () => {
    const response = await apiClient.get('/gallery/admin');
    return response.data.data || response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/gallery/${id}`);
    return response.data.data || response.data;
  },

  create: async (galleryData) => {
    const response = await apiClient.post('/gallery', galleryData);
    return response.data.data || response.data;
  },

  uploadImage: async (formData) => {
    const response = await apiClient.post('/gallery/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data || response.data;
  },

  update: async (id, galleryData) => {
    const response = await apiClient.put(`/gallery/${id}`, galleryData);
    return response.data.data || response.data;
  },

  toggleStatus: async (id) => {
    const response = await apiClient.patch(`/gallery/${id}/toggle`);
    return response.data.data || response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/gallery/${id}`);
    return response.data.data || response.data;
  },
};
