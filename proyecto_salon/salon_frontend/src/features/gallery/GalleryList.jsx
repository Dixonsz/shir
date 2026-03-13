import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import { Plus, CheckCircle2, XCircle, Power } from 'lucide-react';
import { useConfirm } from '../../providers/ConfirmProvider';

function GalleryList({ galleryItems, loading, error, onCreate, onEdit, onDelete, onToggleStatus }) {
  const { confirm } = useConfirm();

  const handleDelete = async (item) => {
    const confirmed = await confirm(
      `¿Estás seguro de eliminar permanentemente "${item.title}"? Esta acción NO se puede deshacer. La imagen será eliminada de Cloudinary y de la base de datos.`,
      {
        title: 'Eliminar Imagen',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    );
    
    if (confirmed) {
      onDelete(item.id);
    }
  };

  const handleToggleStatus = async (item) => {
    const action = item.is_active ? 'desactivar' : 'activar';
    const confirmed = await confirm(
      `¿Deseas ${action} "${item.title}"? ${item.is_active ? 'No se mostrará en la página pública.' : 'Se mostrará en la página pública.'}`,
      {
        title: `${action.charAt(0).toUpperCase() + action.slice(1)} Imagen`,
        confirmText: action.charAt(0).toUpperCase() + action.slice(1),
        cancelText: 'Cancelar'
      }
    );
    
    if (confirmed) {
      onToggleStatus(item.id);
    }
  };

  const columns = [
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

  if (loading) {
    return <div style={styles.message}>Cargando galería...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Gestión de Galería</h1>
        <Button onClick={onCreate} variant="primary">
          <Plus size={20} />
          Nueva Imagen
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={galleryItems}
          onEdit={onEdit}
          onDelete={handleDelete}
          customActions={(item) => (
            <button
              onClick={() => handleToggleStatus(item)}
              title={item.is_active ? 'Desactivar' : 'Activar'}
              style={{
                ...styles.actionButton,
                backgroundColor: item.is_active 
                  ? 'rgba(245, 158, 11, 0.1)' 
                  : 'rgba(16, 185, 129, 0.1)',
                color: item.is_active ? '#f59e0b' : '#10b981',
              }}
            >
              <Power size={18} />
            </button>
          )}
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
  error: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.1rem',
    color: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
  actionButton: {
    border: 'none',
    padding: '0.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
};

export default GalleryList;