import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "combo";

class ComboService {
  getCombos() {
    return axios.get(BASE_URL);
  }

  getComboById(comboId) {
    return axios.get(`${BASE_URL}/${comboId}`);
  }

  createCombo(formData) {
    return axios.post(`${BASE_URL}/create`, formData);
  }

  updateCombo(formData) {
    /*
     * Se utiliza POST porque PHP recibe
     * FormData mediante $_POST y $_FILES.
     */
    return axios.post(`${BASE_URL}/update`, formData);
  }

  changeStatus(combo) {
    return axios.put(`${BASE_URL}/changeStatus`, combo);
  }
}

export default new ComboService();
