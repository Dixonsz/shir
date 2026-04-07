import apiClient from '../../../api/axios';

export const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post('/login', credentials);
    const payload = response?.data ?? {};

    return {
      token: payload.token ?? payload.access_token ?? payload?.data?.token ?? null,
      user: payload.data ?? payload.user ?? null,
    };
  },
};







