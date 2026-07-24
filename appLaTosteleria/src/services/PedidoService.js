import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "pedido";

class PedidoService {
  getOrders(clienteId) {
    const suffix = clienteId ? `?cliente_id=${clienteId}` : "";
    return axios.get(`${BASE_URL}${suffix}`);
  }

  getOrderById(orderId) {
    return axios.get(`${BASE_URL}/${orderId}`);
  }

  createOrder(order) {
    return axios.post(BASE_URL, order);
  }
}

export default new PedidoService();