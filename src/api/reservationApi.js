import axiosClient from './axiosClient';

const reservationApi = {
    getAll: () => axiosClient.get('/phieu-dat-ban'),
    getById: (id) => axiosClient.get(`/phieu-dat-ban/${id}`),
    create: (data) => axiosClient.post('/phieu-dat-ban', data),
    updateStatus: (id, status) => axiosClient.patch(`/phieu-dat-ban/${id}/status?status=${status}`),
    delete: (id) => axiosClient.delete(`/phieu-dat-ban/${id}`),
};

export default reservationApi;
