import axios from "axios";

// Aseguramos que si VITE_BASE_URL no trae el slash final, se lo ponemos antes de concatenar
const cleanBaseUrl = import.meta.env.VITE_BASE_URL.endsWith("/")
  ? import.meta.env.VITE_BASE_URL
  : import.meta.env.VITE_BASE_URL + "/";

const BASE_URL = cleanBaseUrl + "ProcesoPreparacion";

class ProcesoServices {
  // Obtiene la lista completa de procesos
  getProcesos() {
    return axios.get(
      "http://localhost:81/apilatosteleria/ProcesoPreparacionController",
    );
  }

  // Obtiene el detalle sumándole el segmento '/show/ID'
  getProcesoById(procesoId) {
    // Éxito: Le metemos el '/show/' intermedio que pide tu backend en PHP
    return axios.get(BASE_URL + "/show/" + procesoId);
  }
}

export default new ProcesoServices();
