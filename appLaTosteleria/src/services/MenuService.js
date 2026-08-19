import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL + "menu";

class MenuService {
  getMenus() {
    return axios.get(BASE_URL);
  }

  getMenuById(menuId) {
    return axios.get(
      `${BASE_URL}/${menuId}`
    );
  }

  getAvailableMenu() {
    return axios.get(
      `${BASE_URL}/available`
    );
  }

  createMenu(formData) {
    return axios.post(
      `${BASE_URL}/create`,
      formData
    );
  }

  updateMenu(formData) {
    /*
     * Se utiliza POST para que PHP pueda
     * recibir correctamente $_POST y $_FILES.
     */
    return axios.post(
      `${BASE_URL}/update`,
      formData
    );
  }
}

export default new MenuService();