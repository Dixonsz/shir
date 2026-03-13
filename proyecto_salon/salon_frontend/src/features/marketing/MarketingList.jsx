import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import { Plus, CheckCircle2, XCircle } from 'lucide-react';

function MarketingList({ campaigns, loading, onEdit, onDelete, onCreate }) {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('es-ES');
    } catch {
      return '-';
    }
  };

  const isActive = (campaign) => {
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

  const columns = [
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

  if (loading) {
    return <div style={styles.message}>Cargando campañas...</div>;
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Campañas de Marketing</h1>
        <Button onClick={onCreate} variant="primary">
          <Plus size={20} />
          Nueva Campaña
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={campaigns}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </Card>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#e2e8f0',
    margin: 0,
  },
  message: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.1rem',
    color: '#94a3b8',
  },
};

export default MarketingList;
