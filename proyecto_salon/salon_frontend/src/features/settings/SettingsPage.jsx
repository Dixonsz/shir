import { useMemo, useState } from 'react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/forms/Input';
import EntityFormView from '../../components/layout/EntityFormView';
import { showToast } from '../../providers/ToastProvider';
import {
  DEFAULT_CALENDAR_SETTINGS,
  getCalendarSettings,
  saveCalendarSettings,
} from '../../core/calendar/calendarSettings';

const WEEKDAY_OPTIONS = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miercoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sabado' },
];

function SettingsPage() {
  const initial = useMemo(() => getCalendarSettings(), []);
  const [settings, setSettings] = useState(initial);
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newRange, setNewRange] = useState({ start: '12:00', end: '13:00' });

  const handleBusinessHours = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [field]: value,
      },
    }));
  };

  const toggleWeekday = (weekday) => {
    setSettings((prev) => {
      const exists = prev.blockedWeekdays.includes(weekday);
      return {
        ...prev,
        blockedWeekdays: exists
          ? prev.blockedWeekdays.filter((value) => value !== weekday)
          : [...prev.blockedWeekdays, weekday],
      };
    });
  };

  const addBlockedDate = () => {
    if (!newBlockedDate) return;

    setSettings((prev) => ({
      ...prev,
      blockedDates: prev.blockedDates.includes(newBlockedDate)
        ? prev.blockedDates
        : [...prev.blockedDates, newBlockedDate],
    }));
    setNewBlockedDate('');
  };

  const removeBlockedDate = (dateValue) => {
    setSettings((prev) => ({
      ...prev,
      blockedDates: prev.blockedDates.filter((value) => value !== dateValue),
    }));
  };

  const addBlockedRange = () => {
    if (!newRange.start || !newRange.end) return;

    setSettings((prev) => ({
      ...prev,
      blockedTimeRanges: [...prev.blockedTimeRanges, { ...newRange }],
    }));
  };

  const removeBlockedRange = (indexToDelete) => {
    setSettings((prev) => ({
      ...prev,
      blockedTimeRanges: prev.blockedTimeRanges.filter((_, index) => index !== indexToDelete),
    }));
  };

  const handleSave = () => {
    saveCalendarSettings(settings);
    showToast.success('Configuracion de calendario guardada.');
  };

  const handleReset = () => {
    setSettings(DEFAULT_CALENDAR_SETTINGS);
    saveCalendarSettings(DEFAULT_CALENDAR_SETTINGS);
    showToast.success('Configuracion restablecida.');
  };

  return (
    <EntityFormView title="Configuración de Calendario" onBack={() => window.history.back()}>
      <Card style={{ marginBottom: '1rem' }}>
        <h2 style={styles.title}>Horario laboral</h2>
        <div style={styles.grid2}>
          <Input
            label="Hora inicio"
            type="time"
            value={settings.businessHours.start}
            onChange={(event) => handleBusinessHours('start', event.target.value)}
          />
          <Input
            label="Hora cierre"
            type="time"
            value={settings.businessHours.end}
            onChange={(event) => handleBusinessHours('end', event.target.value)}
          />
        </div>
      </Card>

      <Card style={{ marginBottom: '1rem' }}>
        <h2 style={styles.title}>Bloqueo por días de semana</h2>
        <div style={styles.chips}>
          {WEEKDAY_OPTIONS.map((weekday) => {
            const active = settings.blockedWeekdays.includes(weekday.value);
            return (
              <button
                key={weekday.value}
                type="button"
                onClick={() => toggleWeekday(weekday.value)}
                style={{ ...styles.chip, ...(active ? styles.chipActive : null) }}
              >
                {weekday.label}
              </button>
            );
          })}
        </div>
      </Card>

      <Card style={{ marginBottom: '1rem' }}>
        <h2 style={styles.title}>Bloqueo por días especificos</h2>
        <div style={styles.row}>
          <input
            type="date"
            value={newBlockedDate}
            onChange={(event) => setNewBlockedDate(event.target.value)}
            style={styles.input}
          />
          <Button type="button" onClick={addBlockedDate}>Agregar</Button>
        </div>
        <div style={styles.list}>
          {settings.blockedDates.map((dateValue) => (
            <div key={dateValue} style={styles.listItem}>
              <span>{dateValue}</span>
              <Button type="button" variant="danger" size="sm" onClick={() => removeBlockedDate(dateValue)}>
                Quitar
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ marginBottom: '1rem' }}>
        <h2 style={styles.title}>Bloqueo por franjas horarias</h2>
        <div style={styles.row}>
          <input
            type="time"
            value={newRange.start}
            onChange={(event) => setNewRange((prev) => ({ ...prev, start: event.target.value }))}
            style={styles.input}
          />
          <input
            type="time"
            value={newRange.end}
            onChange={(event) => setNewRange((prev) => ({ ...prev, end: event.target.value }))}
            style={styles.input}
          />
          <Button type="button" onClick={addBlockedRange}>Agregar</Button>
        </div>
        <div style={styles.list}>
          {settings.blockedTimeRanges.map((range, index) => (
            <div key={`${range.start}-${range.end}-${index}`} style={styles.listItem}>
              <span>{range.start} - {range.end}</span>
              <Button type="button" variant="danger" size="sm" onClick={() => removeBlockedRange(index)}>
                Quitar
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <div style={styles.footerActions}>
        <Button type="button" variant="outline" onClick={handleReset}>Restablecer</Button>
        <Button type="button" onClick={handleSave}>Guardar configuración</Button>
      </div>
    </EntityFormView>
  );
}

const styles = {
  title: {
    marginTop: 0,
    color: '#e2e8f0',
    fontSize: '1.05rem',
    marginBottom: '0.75rem',
  },
  hintText: {
    marginTop: '-0.3rem',
    marginBottom: '0.75rem',
    color: '#94a3b8',
    fontSize: '0.82rem',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  chip: {
    border: '1px solid rgba(71, 85, 105, 0.7)',
    background: 'rgba(15, 23, 42, 0.45)',
    color: '#cbd5e1',
    borderRadius: '9999px',
    padding: '0.35rem 0.8rem',
    cursor: 'pointer',
  },
  chipActive: {
    border: '1px solid rgba(239, 68, 68, 0.7)',
    background: 'rgba(239, 68, 68, 0.16)',
    color: '#fecaca',
  },
  row: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  input: {
    padding: '0.55rem 0.65rem',
    border: '1px solid rgba(71, 85, 105, 0.7)',
    borderRadius: '8px',
    background: 'rgba(15, 23, 42, 0.7)',
    color: '#e2e8f0',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.55rem 0.7rem',
    border: '1px solid rgba(71, 85, 105, 0.4)',
    borderRadius: '8px',
    color: '#e2e8f0',
    background: 'rgba(15, 23, 42, 0.45)',
  },
  footerActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.6rem',
    marginTop: '1rem',
  },
};

export default SettingsPage;
