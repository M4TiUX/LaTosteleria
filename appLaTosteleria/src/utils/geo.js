// ============================================================
// utils/geo.js
//
// Utilidades para trabajar con rutas reales (arreglos de puntos
// [lat, lng] que vienen de un servicio de ruteo como OSRM) en vez
// de una simple línea recta entre dos coordenadas.
// ============================================================

const EARTH_RADIUS_M = 6371000;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Distancia en metros entre dos puntos [lat, lng] (fórmula Haversine).
 */
export function haversineDistance([lat1, lng1], [lat2, lng2]) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_M * c;
}

/**
 * Dado un arreglo de puntos [lat, lng] que forman una ruta, devuelve
 * un arreglo del mismo largo con la distancia acumulada (en metros)
 * desde el primer punto hasta cada punto.
 */
export function buildCumulativeDistances(coords) {
  if (!Array.isArray(coords) || coords.length === 0) {
    return [];
  }

  const cumulative = [0];

  for (let i = 1; i < coords.length; i += 1) {
    cumulative.push(
      cumulative[i - 1] + haversineDistance(coords[i - 1], coords[i]),
    );
  }

  return cumulative;
}

/**
 * Devuelve el punto [lat, lng] que corresponde a avanzar una
 * `fraction` (0 a 1) de la distancia total de la ruta.
 *
 * Esto es lo que permite que el ícono del repartidor "camine" sobre
 * la ruta real (las calles) en vez de moverse en línea recta.
 */
export function pointAtFraction(coords, cumulativeDistances, fraction) {
  if (!Array.isArray(coords) || coords.length === 0) {
    return null;
  }

  if (coords.length === 1) {
    return coords[0];
  }

  const total = cumulativeDistances[cumulativeDistances.length - 1];
  const clampedFraction = Math.min(1, Math.max(0, fraction));

  if (!total || total <= 0) {
    return coords[0];
  }

  const targetDistance = clampedFraction * total;

  if (targetDistance <= 0) {
    return coords[0];
  }

  if (targetDistance >= total) {
    return coords[coords.length - 1];
  }

  // Buscar el segmento [i-1, i] donde cae la distancia objetivo
  let i = 1;
  while (i < cumulativeDistances.length && cumulativeDistances[i] < targetDistance) {
    i += 1;
  }

  const segStart = cumulativeDistances[i - 1];
  const segEnd = cumulativeDistances[i];
  const segFraction =
    segEnd > segStart ? (targetDistance - segStart) / (segEnd - segStart) : 0;

  const [lat1, lng1] = coords[i - 1];
  const [lat2, lng2] = coords[i];

  return [lat1 + (lat2 - lat1) * segFraction, lng1 + (lng2 - lng1) * segFraction];
}