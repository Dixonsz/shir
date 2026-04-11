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
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  getNotificationSettings,
  saveNotificationSettings,
} from '../../core/notifications/notificationSettings';
import './SettingsPage.css';

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
  const initialNotification = useMemo(() => getNotificationSettings(), []);
  const [settings, setSettings] = useState(initial);
  const [notificationSettings, setNotificationSettings] = useState(initialNotification);
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
    saveNotificationSettings(notificationSettings);
    showToast.success('Configuracion guardada.');
  };

  const handleReset = () => {
    setSettings(DEFAULT_CALENDAR_SETTINGS);
    setNotificationSettings(DEFAULT_NOTIFICATION_SETTINGS);
    saveCalendarSettings(DEFAULT_CALENDAR_SETTINGS);
    saveNotificationSettings(DEFAULT_NOTIFICATION_SETTINGS);
    showToast.success('Configuracion restablecida.');
  };

  return (
    <EntityFormView title="Configuración" onBack={() => window.history.back()}>
      <Card className="settings-card">
        <h2 className="settings-title">Notificaciones</h2>
        <p className="settings-hint-text">
          Correo administrativo para recibir notificaciones de nuevas citas.
        </p>
        <Input
          label="Correo administrativo"
          type="email"
          value={notificationSettings.adminEmail}
          onChange={(event) =>
            setNotificationSettings((prev) => ({
              ...prev,
              adminEmail: event.target.value,
            }))
          }
          placeholder="admin@salon.com"
        />
        <div className="settings-row">
          <label className="settings-checkbox-label">
            <input
              type="checkbox"
              checked={Boolean(notificationSettings.notifyClient)}
              onChange={(event) =>
                setNotificationSettings((prev) => ({
                  ...prev,
                  notifyClient: event.target.checked,
                }))
              }
            />
            Enviar notificaciones al cliente
          </label>
        </div>
        <div className="settings-row">
          <label className="settings-checkbox-label">
            <input
              type="checkbox"
              checked={Boolean(notificationSettings.notifyAdmin)}
              onChange={(event) =>
                setNotificationSettings((prev) => ({
                  ...prev,
                  notifyAdmin: event.target.checked,
                }))
              }
            />
            Enviar notificaciones al administrador
          </label>
        </div>
        <div className="settings-row">
          <label className="settings-checkbox-label">
            <input
              type="checkbox"
              checked={Boolean(notificationSettings.adminCalendarLinkEnabled)}
              onChange={(event) =>
                setNotificationSettings((prev) => ({
                  ...prev,
                  adminCalendarLinkEnabled: event.target.checked,
                }))
              }
            />
            Incluir evento al calendario del administrador
          </label>
        </div>
        <div className="settings-grid2">
          <Input
            label="Duración evento (min)"
            type="number"
            value={notificationSettings.adminIcsDurationMinutes}
            onChange={(event) =>
              setNotificationSettings((prev) => ({
                ...prev,
                adminIcsDurationMinutes: event.target.value,
              }))
            }
            min="15"
            step="5"
          />
          <Input
            label="Ubicación del evento"
            type="text"
            value={notificationSettings.adminIcsLocation}
            onChange={(event) =>
              setNotificationSettings((prev) => ({
                ...prev,
                adminIcsLocation: event.target.value,
              }))
            }
            placeholder="Salon"
          />
        </div>
      </Card>

      <Card className="settings-card">
        <h2 className="settings-title">Horario laboral</h2>
        <div className="settings-grid2">
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

      <Card className="settings-card">
        <h2 className="settings-title">Bloqueo por días de semana</h2>
        <div className="settings-chips">
          {WEEKDAY_OPTIONS.map((weekday) => {
            const active = settings.blockedWeekdays.includes(weekday.value);
            return (
              <button
                key={weekday.value}
                type="button"
                onClick={() => toggleWeekday(weekday.value)}
                className={`settings-chip ${active ? 'settings-chip-active' : ''}`}
              >
                {weekday.label}
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="settings-card">
        <h2 className="settings-title">Bloqueo por días especificos</h2>
        <div className="settings-row settings-row-wrap">
          <input
            type="date"
            value={newBlockedDate}
            onChange={(event) => setNewBlockedDate(event.target.value)}
            className="settings-input"
          />
          <Button type="button" onClick={addBlockedDate}>Agregar</Button>
        </div>
        <div className="settings-list">
          {settings.blockedDates.map((dateValue) => (
            <div key={dateValue} className="settings-list-item">
              <span>{dateValue}</span>
              <Button type="button" variant="danger" size="sm" onClick={() => removeBlockedDate(dateValue)}>
                Quitar
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="settings-card">
        <h2 className="settings-title">Bloqueo por franjas horarias</h2>
        <div className="settings-row settings-row-wrap">
          <input
            type="time"
            value={newRange.start}
            onChange={(event) => setNewRange((prev) => ({ ...prev, start: event.target.value }))}
            className="settings-input"
          />
          <input
            type="time"
            value={newRange.end}
            onChange={(event) => setNewRange((prev) => ({ ...prev, end: event.target.value }))}
            className="settings-input"
          />
          <Button type="button" onClick={addBlockedRange}>Agregar</Button>
        </div>
        <div className="settings-list">
          {settings.blockedTimeRanges.map((range, index) => (
            <div key={`${range.start}-${range.end}-${index}`} className="settings-list-item">
              <span>{range.start} - {range.end}</span>
              <Button type="button" variant="danger" size="sm" onClick={() => removeBlockedRange(index)}>
                Quitar
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <div className="settings-footer-actions">
        <Button type="button" variant="outline" onClick={handleReset}>Restablecer</Button>
        <Button type="button" onClick={handleSave}>Guardar configuración</Button>
      </div>
    </EntityFormView>
  );
}

export default SettingsPage;
