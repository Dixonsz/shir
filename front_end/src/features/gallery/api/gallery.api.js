import apiClient from '../../../api/axios';
import { extractData } from '../../../core/api/response';

export const galleryApi = {
  getAll: async ({ page, pageSize } = {}) => {
    const params = {};
    if (page) params.page = page;
    if (pageSize) params.page_size = pageSize;
    const response = await apiClient.get('/gallery', { params });
    return response?.data ?? extractData(response);
  },

  getAllAdmin: async ({ page, pageSize } = {}) => {
    const params = {};
    if (page) params.page = page;
    if (pageSize) params.page_size = pageSize;
    const response = await apiClient.get('/gallery/admin', { params });
    return response?.data ?? extractData(response);
  },

  getById: async (id) => {
    const response = await apiClient.get(`/gallery/${id}`);
    return extractData(response);
  },

  create: async (galleryData) => {
    const response = await apiClient.post('/gallery', galleryData);
    return extractData(response);
  },

  uploadImage: async (formData) => {
    // Axios agrega el boundary multipart automaticamente en navegador.
    const response = await apiClient.post('/gallery/upload', formData);
    return extractData(response);
  },

  update: async (id, galleryData) => {
    const response = await apiClient.put(`/gallery/${id}`, galleryData);
    return extractData(response);
  },

  toggleStatus: async (id) => {
    const response = await apiClient.patch(`/gallery/${id}/toggle`);
    return extractData(response);
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/gallery/${id}`);
    return extractData(response);
  },
};







