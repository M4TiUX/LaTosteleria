import axios from "axios";

const cleanBaseUrl = import.meta.env.VITE_BASE_URL.endsWith("/")
  ? import.meta.env.VITE_BASE_URL
  : import.meta.env.VITE_BASE_URL + "/";

const BASE_URL = cleanBaseUrl + "ProcesoPreparacionController";

class ProcesoServices {
  // Listar
  getProcesos() {
    return axios.get(BASE_URL);
  }

  // Detalle
  getProcesoById(productoId) {
    return axios.get(`${BASE_URL}/show/${productoId}`);
  }

  // Productos
  getProductos() {
    return axios.get(`${BASE_URL}/productos`);
  }

  // Estaciones
  getEstaciones() {
    return axios.get(`${BASE_URL}/estaciones`);
  }

  // Crear
  createProceso(data) {
    return axios.post(`${BASE_URL}/create`, data);
  }

  // Actualizar
  updateProceso(data) {
    return axios.put(`${BASE_URL}/update`, data);
  }

  // Eliminar
  deleteProceso(productoId) {
    return axios.delete(`${BASE_URL}/delete/${productoId}`);
  }
}

export default new ProcesoServices();
