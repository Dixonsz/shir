import Badge from '../../../components/common/Badge';
import { CheckCircle2, XCircle } from 'lucide-react';

export const getProductColumns = () => [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre' },
  { 
    key: 'price', 
    label: 'Precio',
    render: (value) => `₡${parseFloat(value).toFixed(2)}`
  },
  { 
    key: 'stock', 
    label: 'Stock',
    render: (value, row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>{value}</span>
        {row.in_stock ? (
          <Badge variant="success">Disponible</Badge>
        ) : (
          <Badge variant="danger">Sin stock</Badge>
        )}
      </div>
    )
  },
  { key: 'description', label: 'Descripción' },
  {
    key: 'is_active',
    label: 'Estado',
    render: (value) => (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {value ? (
          <CheckCircle2 size={22} color="#10b981" strokeWidth={2.5} />
        ) : (
          <XCircle size={22} color="#ef4444" strokeWidth={2.5} />
        )}
      </div>
    ),
  },
];









