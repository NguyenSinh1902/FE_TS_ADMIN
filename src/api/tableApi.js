import axiosClient from './axiosClient';

const tableApi = {
    getAll: () => axiosClient.get('/ban'),
    getById: (id) => axiosClient.get(`/ban/${id}`),
    create: (data) => axiosClient.post('/ban', data),
    update: (id, data) => axiosClient.put(`/ban/${id}`, data),
    delete: (id) => axiosClient.delete(`/ban/${id}`),
};

export default tableApi;
