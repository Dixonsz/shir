import axios from 'axios';
import { getApiErrorMessage } from '../core/api/errors';
import { clearToken, getToken } from '../core/auth/tokenStorage';
import { API_BASE_URL } from '../utils/constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = getApiErrorMessage(error);

    error.userMessage = message;

    if (status === 401) {
      clearToken();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    if (status === 403) {
      console.error(message || 'No tienes permisos para realizar esta accion');
    }

    if (status === 500) {
      console.error(message || 'Error del servidor. Por favor, intenta mas tarde.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;

