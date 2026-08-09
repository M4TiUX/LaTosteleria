import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "seguimientoPedido";

class SeguimientoPedidoService {
  getTrackingById(pedidoId) {
    return axios.get(`${BASE_URL}/${pedidoId}`);
  }

  createDemoOrder() {
    return axios.post(`${BASE_URL}/createDemo`);
  }
}

export default new SeguimientoPedidoService();