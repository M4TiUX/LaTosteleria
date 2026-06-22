import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'producto';

class ProductService {

  getProducts() {
    return axios.get(BASE_URL);
  }

  getProductById(ProductId) {
    return axios.get(BASE_URL + '/' + ProductId);
  }

}

export default new ProductService();