import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "categoria";

class CategoryService {
  getCategories() {
    return axios.get(BASE_URL);
  }

  getCategoryById(categoryId) {
    return axios.get(`${BASE_URL}/${categoryId}`);
  }
}

export default new CategoryService();