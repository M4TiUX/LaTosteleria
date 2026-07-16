import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'producto';

class ProductService {

  getProducts() {
    return axios.get(BASE_URL);
  }

  getProductById(ProductId) {
    return axios.get(BASE_URL + '/' + ProductId);
  }

  createProduct(product) {
    return axios.post(BASE_URL, product);
  }

  updateProduct(productId, product) {
    return axios.put(`${BASE_URL}/${productId}`, product);
  }

}

export default new ProductService();