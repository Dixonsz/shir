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

export const isActive = (campaign) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0); 
  
  const start = campaign.start_date ? new Date(campaign.start_date) : null;
  const end = campaign.end_date ? new Date(campaign.end_date) : null;

  if (!start && !end) return true;
  
  if (start) start.setHours(0, 0, 0, 0);
  if (end) end.setHours(0, 0, 0, 0);
  
  if (start && now < start) return false;
  
  if (end && now > end) return false;
  
  return true;
};

export const getMarketingColumns = () => [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre' },
  { 
    key: 'description', 
    label: 'Descripción',
    render: (value) => value || '-'
  },
  { 
    key: 'media_url', 
    label: 'Imagen',
    render: (value) => (
      value ? (
        <img 
          src={value} 
          alt="Campaña" 
          style={{ 
            width: '60px', 
            height: '60px', 
            objectFit: 'cover', 
            borderRadius: '8px' 
          }} 
        />
      ) : '-'
    )
  },
  { 
    key: 'start_date', 
    label: 'Fecha Inicio',
    render: (value) => formatDate(value)
  },
  { 
    key: 'end_date', 
    label: 'Fecha Fin',
    render: (value) => formatDate(value)
  },
  {
    key: 'is_active',
    label: 'Estado',
    render: (value, row) => (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {isActive(row) ? (
          <CheckCircle2 size={22} color="#10b981" strokeWidth={2.5} />
        ) : (
          <XCircle size={22} color="#ef4444" strokeWidth={2.5} />
        )}
      </div>
    ),
  },
];









