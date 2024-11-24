import axios from 'axios';
import config from '../config';

const instance = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    Accept: 'application/json'
  }
});
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      debugger;
      // 401 hatası alındığında token'ı temizleyin ve giriş sayfasına yönlendirin
      localStorage.removeItem('token'); // token'ı temizle
      sessionStorage.removeItem('token');
      window.location.href = '/login'; // Giriş sayfasına yönlendir
    }
    return Promise.reject(error);
  }
);

export default instance;
