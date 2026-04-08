import axiosClient from './axiosClient';

const invoiceApi = {
    getAll: () => axiosClient.get('/hoa-don'),
    getById: (id) => axiosClient.get(`/hoa-don/${id}`),
    getByType: (type) => axiosClient.get(`/hoa-don/loc-theo-loai?loai=${type}`),
    getByDates: (startDate, endDate) => 
        axiosClient.get(`/hoa-don/loc-theo-khoang-ngay?tuNgay=${startDate}&denNgay=${endDate}`),
};

export default invoiceApi;
