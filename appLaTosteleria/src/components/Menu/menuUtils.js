export function formatMenuDate(value) {
  if (!value) {
    return "-";
  }

  const [year, month, day] = String(value).split(/[-/]/).map(Number);

  const date = new Date(year, (month ?? 1) - 1, day ?? 1);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-CR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatMenuTime(value) {
  if (!value) {
    return "-";
  }

  const [hoursPart = "0", minutesPart = "00"] = String(value).split(":");

  let hours = Number(hoursPart);

  if (Number.isNaN(hours)) {
    return value;
  }

  const period = hours >= 12 ? "pm" : "am";

  hours %= 12;

  if (hours === 0) {
    hours = 12;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutesPart).padStart(
    2,
    "0",
  )} ${period}`;
}

export function buildMenuDateTime(dateValue, timeValue) {
  if (!dateValue || !timeValue) {
    return null;
  }

  const [year, month, day] = String(dateValue).split(/[-/]/).map(Number);

  const [hours = 0, minutes = 0, seconds = 0] = String(timeValue)
    .split(":")
    .map(Number);

  const dateTime = new Date(
    year,
    (month ?? 1) - 1,
    day ?? 1,
    hours,
    minutes,
    seconds,
  );

  return Number.isNaN(dateTime.getTime()) ? null : dateTime;
}

/*
 * Construye una fecha (sin hora) a medianoche local,
 * para comparar únicamente el día calendario.
 */
function buildMenuDate(dateValue) {
  if (!dateValue) {
    return null;
  }

  const [year, month, day] = String(dateValue).split(/[-/]/).map(Number);

  const date = new Date(year, (month ?? 1) - 1, day ?? 1);

  return Number.isNaN(date.getTime()) ? null : date;
}

/*
 * Convierte "HH:mm[:ss]" a minutos desde medianoche,
 * para comparar únicamente la hora del día.
 */
function toMinutesOfDay(timeValue) {
  if (!timeValue) {
    return null;
  }

  const [hours, minutes = 0] = String(timeValue).split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
}

export function isMenuAvailable(menu, now = new Date()) {
  /*
   * Un menú inactivo nunca puede
   * estar disponible.
   */
  if (Number(menu.activo) !== 1) {
    return false;
  }

  const startDate = buildMenuDate(menu.fecha_inicio);

  const endDate = buildMenuDate(menu.fecha_fin);

  if (!startDate || !endDate) {
    return false;
  }

  /*
   * El día actual debe estar dentro del
   * rango de fechas del menú.
   */
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (today < startDate || today > endDate) {
    return false;
  }

  const startMinutes = toMinutesOfDay(menu.hora_inicio);

  const endMinutes = toMinutesOfDay(menu.hora_fin);

  if (startMinutes === null || endMinutes === null) {
    return false;
  }

  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  /*
   * La ventana horaria se repite cada día del rango;
   * si hora_fin < hora_inicio, cruza la medianoche.
   */
  if (startMinutes <= endMinutes) {
    return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
  }

  return nowMinutes >= startMinutes || nowMinutes <= endMinutes;
}
