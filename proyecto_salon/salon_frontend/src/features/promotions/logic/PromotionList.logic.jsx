import { CheckCircle2, XCircle } from 'lucide-react';

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('es-ES');
  } catch {
    return '-';
  }
};

export const formatDiscount = (type, value) => {
  if (!type || value === null || value === undefined) return '-';
  if (type === 'porcentual') {
    return `${value}%`;
  }
  return `$${parseFloat(value).toFixed(2)}`;
};

export const getPromotionColumns = () => [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre' },
  { 
    key: 'discount_type', 
    label: 'Descuento',
    render: (value, row) => formatDiscount(row.discount_type, row.discount_value)
  },
  { 
    key: 'start_date', 
    label: 'Fecha Inicio',
    render: (value, row) => formatDate(row.start_date)
  },
  { 
    key: 'end_date', 
    label: 'Fecha Fin',
    render: (value, row) => formatDate(row.end_date)
  },
  {
    key: 'is_active',
    label: 'Estado',
    render: (value, row) => (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {row.is_active ? (
          <CheckCircle2 size={22} color="#10b981" strokeWidth={2.5} />
        ) : (
          <XCircle size={22} color="#ef4444" strokeWidth={2.5} />
        )}
      </div>
    ),
  },
];









