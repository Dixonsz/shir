import Badge from '../../components/common/Badge';
import { CheckCircle2, XCircle } from 'lucide-react';

export const getServiceColumns = () => [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre' },
  { 
    key: 'price', 
    label: 'Precio',
    render: (value, row) => (
      <div>
        <div>₡{parseFloat(value).toFixed(2)}</div>
        {row.promotion && row.price_with_promotion && (
          <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600' }}>
            ₡{parseFloat(row.price_with_promotion).toFixed(2)}
            <Badge variant="success" style={{ marginLeft: '0.5rem', fontSize: '0.675rem' }}>
              {row.promotion.discount_type === 'porcentual' 
                ? `-${row.promotion.discount_value}%`
                : `-₡${row.promotion.discount_value}`
              }
            </Badge>
          </div>
        )}
      </div>
    )
  },
  { 
    key: 'duration_minutes', 
    label: 'Duración',
    render: (value) => `${value} min`
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
