import axiosClient from './axiosClient';

const statsApi = {
  getDashboardStats: () => {
    const url = '/thong-ke/dashboard';
    return axiosClient.get(url);
  },
  getDailyChart: () => {
    const url = '/thong-ke/bieu-do-ngay';
    return axiosClient.get(url);
  },
};

export default statsApi;
