import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "producto";

class ProductService {
  getProducts() {
    return axios.get(BASE_URL);
  }

  getProductById(productId) {
    return axios.get(`${BASE_URL}/${productId}`);
  }

  createProduct(product) {
    return axios.post(`${BASE_URL}/create`, product);
  }

  updateProduct(product) {
    return axios.put(`${BASE_URL}/update`, product);
  }
}

export default new ProductService();