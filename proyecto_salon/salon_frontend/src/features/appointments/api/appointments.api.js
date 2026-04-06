import apiClient from '../../../api/axios';
import { extractData } from '../../../core/api/response';
import { getNotificationSettings } from '../../../core/notifications/notificationSettings';

export const appointmentsApi = {
  getAll: async (includeServices = false, includeTotal = true, { page, pageSize } = {}) => {
    const params = new URLSearchParams();
    if (includeServices) params.append('include_services', 'true');
    if (includeTotal) params.append('include_total', 'true');
    if (page) params.append('page', String(page));
    if (pageSize) params.append('page_size', String(pageSize));
    const queryString = params.toString() ? `?${params.toString()}` : '';
    
    const response = await apiClient.get(`/appointments${queryString}`);

    // Para listados paginados necesitamos conservar la metadata (page/pages/total)
    // y no solo el array de datos.
    return response?.data ?? extractData(response);
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
    const notificationSettings = getNotificationSettings();
    const payload = {
      ...appointmentData,
      admin_notification_email: notificationSettings.adminEmail || undefined,
      notify_client: notificationSettings.notifyClient,
      notify_admin: notificationSettings.notifyAdmin,
      admin_ics_duration_minutes: notificationSettings.adminIcsDurationMinutes,
      admin_ics_location: notificationSettings.adminIcsLocation || undefined,
      admin_calendar_link_enabled: notificationSettings.adminCalendarLinkEnabled,
    };
    const response = await apiClient.post('/appointments', payload);
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







