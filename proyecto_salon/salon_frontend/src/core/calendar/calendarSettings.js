const STORAGE_KEY = 'salon_calendar_settings';

export const DEFAULT_CALENDAR_SETTINGS = {
  businessHours: {
    start: '09:00',
    end: '18:30',
  },
  blockedWeekdays: [],
  blockedDates: [],
  blockedTimeRanges: [],
};

function toMinutes(time) {
  if (!time || typeof time !== 'string') return null;
  const [h, m] = time.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

function normalizeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function sanitizeSettings(rawValue) {
  const source = rawValue && typeof rawValue === 'object' ? rawValue : {};

  const businessStart = typeof source.businessHours?.start === 'string'
    ? source.businessHours.start
    : DEFAULT_CALENDAR_SETTINGS.businessHours.start;

  const businessEnd = typeof source.businessHours?.end === 'string'
    ? source.businessHours.end
    : DEFAULT_CALENDAR_SETTINGS.businessHours.end;

  const blockedWeekdays = Array.isArray(source.blockedWeekdays)
    ? source.blockedWeekdays
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value >= 0 && value <= 6)
    : [];

  const blockedDates = Array.isArray(source.blockedDates)
    ? source.blockedDates.map((value) => normalizeDate(value)).filter(Boolean)
    : [];

  const blockedTimeRanges = Array.isArray(source.blockedTimeRanges)
    ? source.blockedTimeRanges
      .map((range) => ({
        start: range?.start,
        end: range?.end,
      }))
      .filter((range) => toMinutes(range.start) !== null && toMinutes(range.end) !== null)
    : [];

  return {
    businessHours: {
      start: businessStart,
      end: businessEnd,
    },
    blockedWeekdays: [...new Set(blockedWeekdays)],
    blockedDates: [...new Set(blockedDates)],
    blockedTimeRanges,
  };
}

export function getCalendarSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CALENDAR_SETTINGS;

    return sanitizeSettings(JSON.parse(raw));
  } catch {
    return DEFAULT_CALENDAR_SETTINGS;
  }
}

export function saveCalendarSettings(nextSettings) {
  const sanitized = sanitizeSettings(nextSettings);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  return sanitized;
}

export function isDateBlocked(dateInput, settings = getCalendarSettings()) {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return false;

  const weekday = date.getDay();
  const normalizedDate = normalizeDate(date);

  return (
    settings.blockedWeekdays.includes(weekday)
    || settings.blockedDates.includes(normalizedDate)
  );
}

export function isOutsideBusinessHours(dateInput, settings = getCalendarSettings()) {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return false;

  const currentMinutes = date.getHours() * 60 + date.getMinutes();
  const startMinutes = toMinutes(settings.businessHours.start);
  const endMinutes = toMinutes(settings.businessHours.end);

  if (startMinutes === null || endMinutes === null) return false;
  return currentMinutes < startMinutes || currentMinutes > endMinutes;
}

export function isTimeRangeBlocked(dateInput, settings = getCalendarSettings()) {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return false;

  const currentMinutes = date.getHours() * 60 + date.getMinutes();

  return settings.blockedTimeRanges.some((range) => {
    const startMinutes = toMinutes(range.start);
    const endMinutes = toMinutes(range.end);

    if (startMinutes === null || endMinutes === null) return false;
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  });
}

export function isDateTimeBlocked(dateInput, settings = getCalendarSettings()) {
  return (
    isDateBlocked(dateInput, settings)
    || isOutsideBusinessHours(dateInput, settings)
    || isTimeRangeBlocked(dateInput, settings)
  );
}

export function getBlockingReason(dateInput, settings = getCalendarSettings()) {
  if (isDateBlocked(dateInput, settings)) {
    return 'El dia seleccionado esta bloqueado en configuracion.';
  }

  if (isOutsideBusinessHours(dateInput, settings)) {
    return 'La hora esta fuera del horario configurado.';
  }

  if (isTimeRangeBlocked(dateInput, settings)) {
    return 'La hora esta bloqueada por configuracion de calendario.';
  }

  return '';
}
