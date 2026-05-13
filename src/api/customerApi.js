import axiosClient from './axiosClient';

const customerApi = {
    getAll: () => axiosClient.get('/khach-hang'),
    getById: (id) => axiosClient.get(`/khach-hang/${id}`),
    create: (data) => axiosClient.post('/khach-hang', data),
    update: (id, data) => axiosClient.put(`/khach-hang/${id}`, data),
    delete: (id) => axiosClient.delete(`/khach-hang/${id}`),
    getPurchaseHistory: (id, page = 0, size = 10) => axiosClient.get(`/hoa-don/khach-hang/${id}/lich-su?page=${page}&size=${size}`),
};

export default customerApi;
