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

  createMenu(menu) {
    return axios.post(`${BASE_URL}/create`, menu);
  }

  updateMenu(menu) {
    return axios.put(`${BASE_URL}/update`, menu);
  }
}

export default new MenuService();
