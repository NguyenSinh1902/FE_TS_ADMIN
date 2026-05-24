import axiosClient from './axiosClient';

const statsApi = {
  getOverviewToday: () => {
    const url = '/thong-ke/tong-quan-hom-nay';
    return axiosClient.get(url);
  },
  getChartToday: () => {
    const url = '/thong-ke/bieu-do-hom-nay';
    return axiosClient.get(url);
  },
  getDetailedStats: (tuNgay, denNgay) => {
    const url = `/thong-ke/chi-tiet?tuNgay=${tuNgay}&denNgay=${denNgay}`;
    return axiosClient.get(url);
  },
  getRevenueChart: (tuNgay, denNgay, donVi) => {
    const url = `/thong-ke/bieu-do-doanh-thu?tuNgay=${tuNgay}&denNgay=${denNgay}&donVi=${donVi}`;
    return axiosClient.get(url);
  },
  getTopProducts: (tuNgay, denNgay) => {
    const url = `/thong-ke/top-san-pham?tuNgay=${tuNgay}&denNgay=${denNgay}`;
    return axiosClient.get(url);
  },
  getPaymentMethods: (tuNgay, denNgay) => {
    const url = `/thong-ke/phuong-thuc-thanh-toan?tuNgay=${tuNgay}&denNgay=${denNgay}`;
    return axiosClient.get(url);
  },
};

export default statsApi;
