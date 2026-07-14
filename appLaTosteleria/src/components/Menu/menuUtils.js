export function formatMenuDate(value) {
  if (!value) {
    return '-';
  }

  const [year, month, day] = String(value).split(/[-/]/).map(Number);
  const date = new Date(year, (month ?? 1) - 1, day ?? 1);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('es-CR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatMenuTime(value) {
  if (!value) {
    return '-';
  }

  const [hoursPart = '0', minutesPart = '00'] = String(value).split(':');
  let hours = Number(hoursPart);

  if (Number.isNaN(hours)) {
    return value;
  }

  const period = hours >= 12 ? 'pm' : 'am';
  hours %= 12;
  if (hours === 0) {
    hours = 12;
  }

  return `${String(hours).padStart(2, '0')}:${String(minutesPart).padStart(2, '0')} ${period}`;
}

export function buildMenuDateTime(dateValue, timeValue) {
  if (!dateValue || !timeValue) {
    return null;
  }

  const [year, month, day] = String(dateValue).split(/[-/]/).map(Number);
  const [hours = 0, minutes = 0, seconds = 0] = String(timeValue)
    .split(':')
    .map(Number);
  const dateTime = new Date(year, (month ?? 1) - 1, day ?? 1, hours, minutes, seconds);

  return Number.isNaN(dateTime.getTime()) ? null : dateTime;
}

function parseDateOnly(value) {
  if (!value) {
    return null;
  }

  const [year, month, day] = String(value).split(/[-/]/).map(Number);
  const date = new Date(year, (month ?? 1) - 1, day ?? 1);

  return Number.isNaN(date.getTime()) ? null : date;
}

function parseTimeToMinutes(value) {
  if (!value) {
    return null;
  }

  const [hours = 0, minutes = 0] = String(value).split(':').map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
}

export function isMenuAvailable(menu, now = new Date()) {
  const startDate = parseDateOnly(menu.fecha_inicio);
  const endDate = parseDateOnly(menu.fecha_fin);
  const startMinutes = parseTimeToMinutes(menu.hora_inicio);
  const endMinutes = parseTimeToMinutes(menu.hora_fin);

  if (!startDate || !endDate || startMinutes === null || endMinutes === null) {
    return false;
  }

  const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const isWithinDateRange = currentDate >= startDate && currentDate <= endDate;
  const isWithinDailyTimeSlot = currentMinutes >= startMinutes && currentMinutes <= endMinutes;

  return isWithinDateRange && isWithinDailyTimeSlot && Number(menu.activo) === 1;
}