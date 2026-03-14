import apiClient from '../../../api/axios';
import { extractData } from '../../../core/api/response';

export const promotionsApi = {
  getAll: async () => {
    const response = await apiClient.get('/promotions');
    return extractData(response);
  },

  getById: async (id) => {
    const response = await apiClient.get(`/promotions/${id}`);
    return extractData(response);
  },

  create: async (promotionData) => {
    const response = await apiClient.post('/promotions', promotionData);
    return extractData(response);
  },

  update: async (id, promotionData) => {
    const response = await apiClient.put(`/promotions/${id}`, promotionData);
    return extractData(response);
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/promotions/${id}`);
    return extractData(response);
  },
};







