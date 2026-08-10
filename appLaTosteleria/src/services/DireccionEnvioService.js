import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL +
  "direccionEnvio";

class DireccionEnvioService {
  // ==========================================
  // OBTENER DIRECCIONES DEL CLIENTE
  // ==========================================

  getDirecciones(usuarioId) {
    /*
      /direccionEnvio?usuario_id=2
    */

    return axios.get(
      `${BASE_URL}?usuario_id=${usuarioId}`,
    );
  }

  // ==========================================
  // OBTENER DIRECCIÓN POR ID
  // ==========================================

  getDireccionById(direccionId) {
    return axios.get(
      `${BASE_URL}/${direccionId}`,
    );
  }

  // ==========================================
  // CREAR DIRECCIÓN (desde el mapa)
  // ==========================================

  createDireccion(direccion) {
    return axios.post(
      BASE_URL,
      direccion,
    );
  }

  // ==========================================
  // ACTUALIZAR DIRECCIÓN
  // ==========================================

  updateDireccion(direccionId, direccion) {
    return axios.put(
      `${BASE_URL}/${direccionId}`,
      direccion,
    );
  }

  // ==========================================
  // ELIMINAR DIRECCIÓN
  // ==========================================

  deleteDireccion(direccionId) {
    return axios.delete(
      `${BASE_URL}/${direccionId}`,
    );
  }
}

export default new DireccionEnvioService();