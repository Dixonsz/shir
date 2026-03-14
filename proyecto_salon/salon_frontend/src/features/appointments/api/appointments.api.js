import apiClient from '../../../api/axios';
import { extractData } from '../../../core/api/response';

export const appointmentsApi = {
  getAll: async (includeServices = false, includeTotal = true) => {
    const params = new URLSearchParams();
    if (includeServices) params.append('include_services', 'true');
    if (includeTotal) params.append('include_total', 'true');
    const queryString = params.toString() ? `?${params.toString()}` : '';
    
    const response = await apiClient.get(`/appointments${queryString}`);
    return extractData(response);
  },

  getById: async (id, includeServices = true, includeTotal = true) => {
    const params = new URLSearchParams();
    if (includeServices) params.append('include_services', 'true');
    if (includeTotal) params.append('include_total', 'true');
    const queryString = params.toString() ? `?${params.toString()}` : '';
    
    const response = await apiClient.get(`/appointments/${id}${queryString}`);
    return extractData(response);
  },

  getByClient: async (clientId) => {
    const response = await apiClient.get(`/appointments/client/${clientId}`);
    return extractData(response);
  },

  getByMember: async (memberId) => {
    const response = await apiClient.get(`/appointments/member/${memberId}`);
    return extractData(response);
  },

  create: async (appointmentData) => {
    const response = await apiClient.post('/appointments', appointmentData);
    return extractData(response);
  },

  update: async (id, appointmentData) => {
    const response = await apiClient.put(`/appointments/${id}`, appointmentData);
    return extractData(response);
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/appointments/${id}`);
    return extractData(response);
  },

  
  getSummary: async (id) => {
    const response = await apiClient.get(`/appointments/${id}/summary`);
    return extractData(response);
  },

  getServices: async (appointmentId) => {
    const response = await apiClient.get(`/appointments/${appointmentId}/services`);
    return extractData(response);
  },

  addService: async (appointmentId, serviceData) => {
    const response = await apiClient.post(`/appointments/${appointmentId}/services`, serviceData);
    return extractData(response);
  },

  updateService: async (appointmentId, appointmentServiceId, serviceData) => {
    const response = await apiClient.put(`/appointments/${appointmentId}/services/${appointmentServiceId}`, serviceData);
    return extractData(response);
  },

  removeService: async (appointmentId, appointmentServiceId) => {
    const response = await apiClient.delete(`/appointments/${appointmentId}/services/${appointmentServiceId}`);
    return extractData(response);
  },

  getServiceProducts: async (appointmentId, appointmentServiceId) => {
    const response = await apiClient.get(`/appointments/${appointmentId}/services/${appointmentServiceId}/products`);
    return extractData(response);
  },

  addProductToService: async (appointmentId, appointmentServiceId, productData) => {
    const response = await apiClient.post(`/appointments/${appointmentId}/services/${appointmentServiceId}/products`, productData);
    return extractData(response);
  },

  updateServiceProduct: async (appointmentId, appointmentServiceId, serviceProductId, productData) => {
    const response = await apiClient.put(`/appointments/${appointmentId}/services/${appointmentServiceId}/products/${serviceProductId}`, productData);
    return extractData(response);
  },

  removeProductFromService: async (appointmentId, appointmentServiceId, serviceProductId) => {
    const response = await apiClient.delete(`/appointments/${appointmentId}/services/${appointmentServiceId}/products/${serviceProductId}`);
    return extractData(response);
  },

  getAdditionals: async (appointmentId) => {
    const response = await apiClient.get(`/appointments/${appointmentId}/additionals`);
    return extractData(response);
  },

  addAdditional: async (appointmentId, additionalData) => {
    const response = await apiClient.post(`/appointments/${appointmentId}/additionals`, additionalData);
    return extractData(response);
  },

  updateAdditional: async (appointmentId, additionalId, additionalData) => {
    const response = await apiClient.put(`/appointments/${appointmentId}/additionals/${additionalId}`, additionalData);
    return extractData(response);
  },

  removeAdditional: async (appointmentId, additionalId) => {
    const response = await apiClient.delete(`/appointments/${appointmentId}/additionals/${additionalId}`);
    return extractData(response);
  },
};







