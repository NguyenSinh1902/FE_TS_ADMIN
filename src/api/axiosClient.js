import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://10.0.2.2:8080/api', // Adjust if testing on physical device
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
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
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export default axiosClient;
