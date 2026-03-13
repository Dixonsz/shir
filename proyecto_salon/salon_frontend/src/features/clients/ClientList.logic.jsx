import Avatar from '../../components/common/Avatar';
import { CheckCircle2, XCircle } from 'lucide-react';

export const getClientColumns = () => [
  { 
    key: 'photo', 
    label: 'Foto',
    render: (value, row) => (
      <Avatar src={row.photo_url} alt={row.name} size="small" />
    )
  },
  { key: 'id', label: 'ID' },
  { key: 'number_id', label: 'Identificación' },
  { key: 'name', label: 'Nombre' },
  { key: 'email', label: 'Correo' },
  { key: 'phone_number', label: 'Teléfono' },
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
