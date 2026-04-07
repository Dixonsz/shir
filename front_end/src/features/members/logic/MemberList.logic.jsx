import Avatar from '../../../components/common/Avatar';
import { CheckCircle2, XCircle } from 'lucide-react';

export const getMemberColumns = () => [
  { 
    key: 'photo', 
    label: 'Foto',
    render: (value, row) => (
      <Avatar src={row.photo_url} alt={row.full_name || `${row.first_name} ${row.last_name}`} size="small" />
    )
  },
  { key: 'id', label: 'ID' },
  { 
    key: 'full_name', 
    label: 'Nombre Completo',
    render: (value, row) => value || `${row.first_name} ${row.last_name}`
  },
  { key: 'email', label: 'Correo' },
  { key: 'phone_number', label: 'Teléfono' },
  { key: 'specialty', label: 'Especialidad' },
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









