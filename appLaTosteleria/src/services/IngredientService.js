import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "ingrediente";

class IngredientService {
  getIngredients() {
    return axios.get(BASE_URL);
  }

  getIngredientById(ingredientId) {
    return axios.get(`${BASE_URL}/${ingredientId}`);
  }
}

export default new IngredientService();