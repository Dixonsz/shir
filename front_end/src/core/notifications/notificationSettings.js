const STORAGE_KEY = 'salon_notification_settings';

export const DEFAULT_NOTIFICATION_SETTINGS = {
  adminEmail: '',
  notifyClient: true,
  notifyAdmin: true,
  adminIcsDurationMinutes: 60,
  adminIcsLocation: 'Salon',
  adminCalendarLinkEnabled: true,
};

function sanitizeSettings(rawValue) {
  const source = rawValue && typeof rawValue === 'object' ? rawValue : {};
  const parsedDuration = Number.parseInt(source.adminIcsDurationMinutes, 10);

  return {
    adminEmail: typeof source.adminEmail === 'string' ? source.adminEmail.trim() : '',
    notifyClient: typeof source.notifyClient === 'boolean'
      ? source.notifyClient
      : String(source.notifyClient).trim().toLowerCase() !== 'false',
    notifyAdmin: typeof source.notifyAdmin === 'boolean'
      ? source.notifyAdmin
      : String(source.notifyAdmin).trim().toLowerCase() !== 'false',
    adminIcsDurationMinutes: Number.isFinite(parsedDuration) && parsedDuration > 0 ? parsedDuration : 60,
    adminIcsLocation: typeof source.adminIcsLocation === 'string' && source.adminIcsLocation.trim()
      ? source.adminIcsLocation.trim()
      : 'Salon',
    adminCalendarLinkEnabled: typeof source.adminCalendarLinkEnabled === 'boolean'
      ? source.adminCalendarLinkEnabled
      : String(source.adminCalendarLinkEnabled).trim().toLowerCase() !== 'false',
  };
}

export function getNotificationSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_NOTIFICATION_SETTINGS;
    }

    return {
      ...DEFAULT_NOTIFICATION_SETTINGS,
      ...sanitizeSettings(JSON.parse(raw)),
    };
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

export function saveNotificationSettings(nextSettings) {
  const sanitized = sanitizeSettings(nextSettings);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  return sanitized;
}
