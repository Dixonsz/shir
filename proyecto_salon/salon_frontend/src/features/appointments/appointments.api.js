import apiClient from '../../api/axios';

export const appointmentsApi = {
  getAll: async (includeServices = false, includeTotal = true) => {
    const params = new URLSearchParams();
    if (includeServices) params.append('include_services', 'true');
    if (includeTotal) params.append('include_total', 'true');
    const queryString = params.toString() ? `?${params.toString()}` : '';
    
    const response = await apiClient.get(`/appointments${queryString}`);
    return response.data.data || response.data;
  },

  getById: async (id, includeServices = true, includeTotal = true) => {
    const params = new URLSearchParams();
    if (includeServices) params.append('include_services', 'true');
    if (includeTotal) params.append('include_total', 'true');
    const queryString = params.toString() ? `?${params.toString()}` : '';
    
    const response = await apiClient.get(`/appointments/${id}${queryString}`);
    return response.data.data || response.data;
  },

  getByClient: async (clientId) => {
    const response = await apiClient.get(`/appointments/client/${clientId}`);
    return response.data.data || response.data;
  },

  getByMember: async (memberId) => {
    const response = await apiClient.get(`/appointments/member/${memberId}`);
    return response.data.data || response.data;
  },

  create: async (appointmentData) => {
    const response = await apiClient.post('/appointments', appointmentData);
    return response.data.data || response.data;
  },

  update: async (id, appointmentData) => {
    const response = await apiClient.put(`/appointments/${id}`, appointmentData);
    return response.data.data || response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/appointments/${id}`);
    return response.data;
  },

  
  getSummary: async (id) => {
    const response = await apiClient.get(`/appointments/${id}/summary`);
    return response.data.data || response.data;
  },

  getServices: async (appointmentId) => {
    const response = await apiClient.get(`/appointments/${appointmentId}/services`);
    return response.data.data || response.data;
  },

  addService: async (appointmentId, serviceData) => {
    const response = await apiClient.post(`/appointments/${appointmentId}/services`, serviceData);
    return response.data.data || response.data;
  },

  updateService: async (appointmentId, appointmentServiceId, serviceData) => {
    const response = await apiClient.put(`/appointments/${appointmentId}/services/${appointmentServiceId}`, serviceData);
    return response.data.data || response.data;
  },

  removeService: async (appointmentId, appointmentServiceId) => {
    const response = await apiClient.delete(`/appointments/${appointmentId}/services/${appointmentServiceId}`);
    return response.data;
  },

  getServiceProducts: async (appointmentId, appointmentServiceId) => {
    const response = await apiClient.get(`/appointments/${appointmentId}/services/${appointmentServiceId}/products`);
    return response.data.data || response.data;
  },

  addProductToService: async (appointmentId, appointmentServiceId, productData) => {
    const response = await apiClient.post(`/appointments/${appointmentId}/services/${appointmentServiceId}/products`, productData);
    return response.data.data || response.data;
  },

  updateServiceProduct: async (appointmentId, appointmentServiceId, serviceProductId, productData) => {
    const response = await apiClient.put(`/appointments/${appointmentId}/services/${appointmentServiceId}/products/${serviceProductId}`, productData);
    return response.data.data || response.data;
  },

  removeProductFromService: async (appointmentId, appointmentServiceId, serviceProductId) => {
    const response = await apiClient.delete(`/appointments/${appointmentId}/services/${appointmentServiceId}/products/${serviceProductId}`);
    return response.data;
  },

  getAdditionals: async (appointmentId) => {
    const response = await apiClient.get(`/appointments/${appointmentId}/additionals`);
    return response.data.data || response.data;
  },

  addAdditional: async (appointmentId, additionalData) => {
    const response = await apiClient.post(`/appointments/${appointmentId}/additionals`, additionalData);
    return response.data.data || response.data;
  },

  updateAdditional: async (appointmentId, additionalId, additionalData) => {
    const response = await apiClient.put(`/appointments/${appointmentId}/additionals/${additionalId}`, additionalData);
    return response.data.data || response.data;
  },

  removeAdditional: async (appointmentId, additionalId) => {
    const response = await apiClient.delete(`/appointments/${appointmentId}/additionals/${additionalId}`);
    return response.data;
  },
};
