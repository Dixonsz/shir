import apiClient from '../../../api/axios';

function formatDate(value) {
  if (!value) return '';
  const dateValue = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dateValue.getTime())) return '';

  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, '0');
  const day = String(dateValue.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildCommonParams(filters = {}) {
  const params = new URLSearchParams();

  if (filters.fromDate) {
    params.append('from_date', formatDate(filters.fromDate));
  }

  if (filters.toDate) {
    params.append('to_date', formatDate(filters.toDate));
  }

  if (filters.status) {
    params.append('status', filters.status);
  }

  if (filters.limit) {
    params.append('limit', String(filters.limit));
  }

  return params;
}

async function get(url, filters) {
  const params = buildCommonParams(filters);
  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await apiClient.get(`${url}${query}`);
  return response?.data?.data ?? [];
}

export const reportsApi = {
  getSummary: async (filters) => get('/reports/summary', filters),
  getServices: async (filters) => get('/reports/services', filters),
  getProductsRelated: async (filters) => get('/reports/products-related', filters),
  getClients: async (filters) => get('/reports/clients', filters),
  getMembers: async (filters) => get('/reports/members', filters),
  getRevenueTimeline: async (filters) => get('/reports/revenue-timeline', filters),
  getInventory: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.lowStockThreshold !== undefined) {
      params.append('low_stock_threshold', String(filters.lowStockThreshold));
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiClient.get(`/reports/inventory${query}`);
    return response?.data?.data ?? {};
  },
  exportUrl: (reportType, formatType = 'csv', filters = {}) => {
    const params = buildCommonParams(filters);
    params.set('report', reportType);
    params.set('format', formatType);
    const query = params.toString() ? `?${params.toString()}` : '';
    return `/reports/export${query}`;
  },
};
