import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "producto";

class ProductService {
  getProducts() {
    return axios.get(BASE_URL);
  }

  getProductById(productId) {
    return axios.get(`${BASE_URL}/${productId}`);
  }

  createProduct(formData) {
    return axios.post(`${BASE_URL}/create`, formData);
  }

  updateProduct(formData) {
    return axios.post(`${BASE_URL}/update`, formData);
  }
}

export default new ProductService();
