const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving";

class RouteService {
  async getRoute(origin, destination) {
    const coordinates = [origin, destination].map(({ lat, lng }) => [
      Number(lng),
      Number(lat),
    ]);

    if (
      coordinates.some(
        ([lng, lat]) => !Number.isFinite(lng) || !Number.isFinite(lat),
      )
    ) {
      throw new Error("Las coordenadas de la ruta no son válidas.");
    }

    const routeUrl = new URL(
      `${OSRM_BASE_URL}/${coordinates.map(([lng, lat]) => `${lng},${lat}`).join(";")}`,
    );
    routeUrl.searchParams.set("overview", "full");
    routeUrl.searchParams.set("geometries", "geojson");

    const response = await fetch(routeUrl);

    if (!response.ok) {
      throw new Error(`No se pudo obtener la ruta (${response.status}).`);
    }

    const data = await response.json();
    const route = data?.routes?.[0];
    const routeCoordinates = route?.geometry?.coordinates;

    if (!Array.isArray(routeCoordinates) || routeCoordinates.length < 2) {
      throw new Error(
        "No se encontró una ruta para las coordenadas indicadas.",
      );
    }

    return {
      ...route,
      coordenadas: routeCoordinates.map(([lng, lat]) => [lat, lng]),
    };
  }
}

export default new RouteService();
