export const formatPrice = (price) => {
  if (price === null || price === undefined) return '₡0.00';
  return `₡${parseFloat(price).toFixed(2)}`;
};

export const getAdditionalColumns = () => [
  { key: 'id', label: 'ID' },
  { key: 'concept', label: 'Concepto' },
  { 
    key: 'price', 
    label: 'Precio',
    render: (value, row) => formatPrice(row.price)
  },
  { 
    key: 'appointment_id', 
    label: 'ID Cita',
    render: (value, row) => row.appointment_id || 'Sin asignar'
  },
];









