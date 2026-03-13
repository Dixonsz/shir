import apiClient from '../../api/axios';

export const marketingApi = {
  getAll: async () => {
    const response = await apiClient.get('/marketing');
    return response.data.data || response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/marketing/${id}`);
    return response.data.data || response.data;
  },

  getActive: async () => {
    const response = await apiClient.get('/marketing/active');
    return response.data.data || response.data;
  },

  getByPromotion: async (promotionId) => {
    const response = await apiClient.get(`/marketing/promotion/${promotionId}`);
    return response.data.data || response.data;
  },

  createWithImage: async (marketingData) => {
    console.log('=== API: Creando FormData ===');
    console.log('marketingData:', marketingData);
    
    const formData = new FormData();
    
    formData.append('name', marketingData.name);
    if (marketingData.description) formData.append('description', marketingData.description);
    if (marketingData.promotion_id) formData.append('promotion_id', marketingData.promotion_id);
    if (marketingData.start_date && marketingData.start_date !== '') formData.append('start_date', marketingData.start_date);
    if (marketingData.end_date && marketingData.end_date !== '') formData.append('end_date', marketingData.end_date);
    
    if (marketingData.image) {
      formData.append('image', marketingData.image);
      console.log('✓ Imagen agregada al FormData:', marketingData.image.name, '(', marketingData.image.size, 'bytes)');
    } else {
      console.log('✗ No hay imagen para agregar');
    }
    
    console.log('=== Contenido del FormData ===');
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(pair[0] + ':', 'File -', pair[1].name, '-', pair[1].size, 'bytes');
      } else {
        console.log(pair[0] + ':', pair[1]);
      }
    }
    
    console.log('Enviando FormData al servidor...');
    const response = await apiClient.post('/marketing/with-image', formData);
    console.log('Respuesta del servidor:', response.data);
    return response.data.data || response.data;
  },

  create: async (marketingData) => {
    const response = await apiClient.post('/marketing', marketingData);
    return response.data.data || response.data;
  },

  update: async (id, marketingData) => {
    const cleanData = {
      name: marketingData.name,
      description: marketingData.description || null,
      promotion_id: marketingData.promotion_id || null,
      start_date: marketingData.start_date && marketingData.start_date !== '' ? marketingData.start_date : null,
      end_date: marketingData.end_date && marketingData.end_date !== '' ? marketingData.end_date : null
    };
    
    console.log('=== Actualizando campaña sin cambiar imagen ===');
    console.log('ID:', id);
    console.log('Datos limpios:', cleanData);
    
    const response = await apiClient.put(`/marketing/${id}`, cleanData);
    return response.data.data || response.data;
  },

  updateWithImage: async (id, marketingData) => {
    const formData = new FormData();
    
    formData.append('name', marketingData.name);
    if (marketingData.description) formData.append('description', marketingData.description);
    if (marketingData.promotion_id) formData.append('promotion_id', marketingData.promotion_id);
    if (marketingData.start_date && marketingData.start_date !== '') formData.append('start_date', marketingData.start_date);
    if (marketingData.end_date && marketingData.end_date !== '') formData.append('end_date', marketingData.end_date);
    
    if (marketingData.image) {
      formData.append('image', marketingData.image);
      console.log('Nueva imagen incluida en actualización');
    }
    
    console.log('=== Actualizando campaña con ID:', id, '===');
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(pair[0] + ':', 'File -', pair[1].name, '-', pair[1].size, 'bytes');
      } else {
        console.log(pair[0] + ':', pair[1]);
      }
    }
    
    const response = await apiClient.put(`/marketing/${id}/with-image`, formData);
    console.log('Respuesta de actualización:', response.data);
    return response.data.data || response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/marketing/${id}`);
    return response.data;
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data || response.data;
  },

  deleteImage: async (publicId) => {
    const response = await apiClient.post('/delete', { public_id: publicId });
    return response.data;
  },
};
