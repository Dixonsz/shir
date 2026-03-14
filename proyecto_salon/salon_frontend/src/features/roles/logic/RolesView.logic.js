import { CheckCircle2, XCircle } from 'lucide-react';

export const getRoleColumns = () => [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre' },
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









