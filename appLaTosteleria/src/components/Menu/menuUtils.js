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

export function isMenuAvailable(menu, now = new Date()) {
  /*
   * Un menú inactivo nunca puede
   * estar disponible.
   */
  if (Number(menu.activo) !== 1) {
    return false;
  }

  /*
   * Construimos fecha + hora completas.
   */
  const startDateTime = buildMenuDateTime(menu.fecha_inicio, menu.hora_inicio);

  const endDateTime = buildMenuDateTime(menu.fecha_fin, menu.hora_fin);

  if (!startDateTime || !endDateTime) {
    return false;
  }

  /*
   * La fecha y hora actual debe estar
   * dentro del rango completo.
   */
  return now >= startDateTime && now <= endDateTime;
}