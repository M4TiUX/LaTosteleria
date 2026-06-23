import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'menu';

class MenuService {
  getMenus() {
    return axios.get(BASE_URL);
  }

  getMenuById(menuId) {
    return axios.get(`${BASE_URL}/${menuId}`);
  }

  getAvailableMenu() {
    return axios.get(`${BASE_URL}/available`);
  }
}

export default new MenuService();
