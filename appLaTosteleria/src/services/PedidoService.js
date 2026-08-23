import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "pedido";

class PedidoService {
  // ==========================================
  // OBTENER PEDIDOS
  // ==========================================

  getOrders(clienteId = null) {
    /*
      Si recibe clienteId:
      /pedido?cliente_id=2

      Si no recibe clienteId:
      /pedido
    */

    const suffix = clienteId ? `?cliente_id=${clienteId}` : "";

    return axios.get(`${BASE_URL}${suffix}`);
  }

  // ==========================================
  // OBTENER PEDIDO POR ID
  // ==========================================

  getOrderById(orderId) {
    return axios.get(`${BASE_URL}/${orderId}`);
  }

  // ==========================================
  // CREAR PEDIDO
  // ==========================================

  createOrder(order) {
    return axios.post(BASE_URL, order);
  }

  getDashboardSummary() {
    return axios.get(`${BASE_URL}/dashboard`);
  }

  getPreparation(orderId) {
    return axios.get(`${BASE_URL}/preparation/${orderId}`);
  }

  advancePreparation(orderId, stationId) {
    return axios.post(`${BASE_URL}/advancePreparation`, {
      pedido_id: orderId,
      station_id: stationId,
    });
  }
}

export default new PedidoService();
