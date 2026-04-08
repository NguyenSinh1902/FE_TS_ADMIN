import axiosClient from './axiosClient';

const customerApi = {
    getAll: () => axiosClient.get('/khach-hang'),
    getById: (id) => axiosClient.get(`/khach-hang/${id}`),
    create: (data) => axiosClient.post('/khach-hang', data),
    update: (id, data) => axiosClient.put(`/khach-hang/${id}`, data),
    delete: (id) => axiosClient.delete(`/khach-hang/${id}`),
};

export default customerApi;
