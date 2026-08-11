import axios from "axios";

// ============================================================
// update_location.php es un script standalone en la raiz del
// proyecto backend (junto a index.php), NO pasa por el router.
//
// VITE_BASE_URL ya apunta a la raiz del backend:
//   VITE_BASE_URL = "http://localhost:81/apilatosteleria/"
//   UPDATE_LOCATION_URL = "http://localhost:81/apilatosteleria/update_location.php"
// ============================================================

const UPDATE_LOCATION_URL = `${import.meta.env.VITE_BASE_URL}update_location.php`;

class UbicacionRepartidorService {
  // ==========================================================
  // CONSULTAR (simula/interpola) la posicion actual
  // ==========================================================

  getUbicacion(pedidoId) {
    return axios.get(`${UPDATE_LOCATION_URL}?pedido_id=${pedidoId}`);
  }

  // ==========================================================
  // ENVIAR una posicion real (uso futuro: app de repartidor)
  // ==========================================================

  enviarUbicacion(pedidoId, latitud, longitud) {
    return axios.post(UPDATE_LOCATION_URL, {
      pedido_id: pedidoId,
      latitud,
      longitud,
    });
  }
}

export default new UbicacionRepartidorService();