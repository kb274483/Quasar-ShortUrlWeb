import Axios from 'axios';
import initializeStore  from '../store';
const API_BASE_URL = '/url_api';

const store = initializeStore();
const api = Axios.create({
  baseURL: API_BASE_URL,
});
api.interceptors.request.use(
  config => {
    const token = store.state.module.jwtToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;
