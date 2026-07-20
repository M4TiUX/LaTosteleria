import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "combo";

class ComboService {
  getCombos() {
    return axios.get(BASE_URL);
  }

  getComboById(ComboId) {
    return axios.get(BASE_URL + "/" + ComboId);
  }

  createCombo(combo) {
    return axios.post(`${BASE_URL}/create`, combo);
  }

  updateCombo(combo) {
    return axios.put(`${BASE_URL}/update`, combo);
  }

  changeStatus(combo) {
    return axios.put(`${BASE_URL}/changeStatus`, combo);
  }
}

export default new ComboService();
