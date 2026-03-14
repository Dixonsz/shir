export const APPOINTMENT_STATUS_CONFIG = {
  scheduled: {
    label: 'Programada',
    color: '#3b82f6',
    badgeVariant: 'info',
  },
  confirmed: {
    label: 'Confirmada',
    color: '#10b981',
    badgeVariant: 'success',
  },
  in_progress: {
    label: 'En progreso',
    color: '#f59e0b',
    badgeVariant: 'warning',
  },
  completed: {
    label: 'Completada',
    color: '#8b5cf6',
    badgeVariant: 'completed',
  },
  cancelled: {
    label: 'Cancelada',
    color: '#ef4444',
    badgeVariant: 'danger',
  },
  'no-show': {
    label: 'No asistio',
    color: '#64748b',
    badgeVariant: 'warning',
  },
};

const DEFAULT_STATUS_CONFIG = {
  label: 'Sin estado',
  color: '#6b7280',
  badgeVariant: 'default',
};

export function getAppointmentStatusConfig(status) {
  return APPOINTMENT_STATUS_CONFIG[status] || DEFAULT_STATUS_CONFIG;
}
