import { CheckCircle2, XCircle } from 'lucide-react';

export const getGalleryColumns = () => [
  { key: 'id', label: 'ID' },
  { 
    key: 'image_url', 
    label: 'Imagen',
    render: (value, row) => (
      <img 
        src={value} 
        alt={row.title} 
        style={{ 
          width: '80px', 
          height: '80px', 
          objectFit: 'cover', 
          borderRadius: '8px' 
        }} 
      />
    )
  },
  { key: 'title', label: 'Título' },
  { 
    key: 'description', 
    label: 'Descripción',
    render: (value) => value || '-'
  },
  { 
    key: 'order', 
    label: 'Orden',
    render: (value) => value || 0
  },
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
