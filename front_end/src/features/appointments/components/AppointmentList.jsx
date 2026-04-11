import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';
import { Plus, ClipboardCheck, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAppointmentStatusConfig } from '../utils/appointmentStatus';
import { usePermissions } from '../../auth/hooks';

function AppointmentList({ appointments, clients, members, loading, onEdit, onDelete, onCreate, pagination, isMutating = false }) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 760;
  });
  const { canWriteResource } = usePermissions();
  const canWrite = canWriteResource('appointments');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setIsMobile(window.innerWidth <= 760);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '-';
    }
  };

  const getClientName = (clientId) => {
    const normalizedId = Number(clientId);
    const client = clients.find((c) => Number(c.id) === normalizedId);
    return client ? client.name : `ID: ${clientId}`;
  };

  const getMemberName = (memberId) => {
    const normalizedId = Number(memberId);
    const member = members.find((m) => Number(m.id) === normalizedId);
    return member ? `${member.first_name} ${member.last_name}` : `ID: ${memberId}`;
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'client_id', 
      label: 'Cliente',
      render: (value, row) => getClientName(row.client_id)
    },
    { 
      key: 'member_id', 
      label: 'Miembro',
      render: (value, row) => getMemberName(row.member_id)
    },
    { 
      key: 'scheduled_date', 
      label: 'Fecha y Hora',
      render: (value, row) => formatDateTime(row.scheduled_date)
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value, row) => (
        <Badge variant={getAppointmentStatusConfig(row.status).badgeVariant}>
          {getAppointmentStatusConfig(row.status).label}
        </Badge>
      ),
    },
    {
      key: 'total_price',
      label: 'Total',
      render: (value, row) => (
        value !== undefined ? (
          <span style={{ fontWeight: '600', color: '#10b981' }}>
            ₡{parseFloat(value).toFixed(2)}
          </span>
        ) : '-'
      ),
    },
    {
      key: 'is_active',
      label: 'Activa',
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

  return (
    <div>
      <div style={{ ...styles.header, ...(isMobile ? styles.headerMobile : null) }}>
        <h1 style={{ ...styles.title, ...(isMobile ? styles.titleMobile : null) }}>Citas</h1>
        {canWrite ? (
          <Button onClick={onCreate} fullWidth={isMobile} disabled={isMutating}>
            <Plus size={20} />
            {isMutating ? 'Procesando...' : 'Nueva Cita'}
          </Button>
        ) : null}
      </div>

      {loading ? (
        <p>Cargando citas...</p>
      ) : (
        <Table
          columns={columns}
          data={appointments}
          onEdit={canWrite && !isMutating ? onEdit : undefined}
          onDelete={canWrite && !isMutating ? onDelete : undefined}
          {...pagination}
          customActions={canWrite ? (row) => (
            <Button
              variant="success"
              size="sm"
              onClick={() => navigate(`/dashboard/appointments/${row.id}/service`)}
              title="Atender cita"
              disabled={isMutating}
            >
              <ClipboardCheck size={16} />
            </Button>
          ) : undefined}
        />
      )}
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
  headerMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '0.75rem',
    marginBottom: '1.2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#e2e8f0',
    margin: 0,
  },
  titleMobile: {
    fontSize: '1.45rem',
  },
};

export default AppointmentList;











