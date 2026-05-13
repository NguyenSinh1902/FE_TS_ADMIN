import axios from 'axios';
import safeAsyncStorage from '../utils/storage';

const axiosClient = axios.create({
  baseURL: 'http://10.0.2.2:8080/api', // Adjust if testing on physical device
  timeout: 40000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    const token = await safeAsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    console.log('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export default axiosClient;
