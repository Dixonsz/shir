import apiClient from '../../../api/axios';
import { extractData } from '../../../core/api/response';

export const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post('/login', credentials);
    return extractData(response);
  },
};







