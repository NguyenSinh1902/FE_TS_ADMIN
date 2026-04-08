import axiosClient from './axiosClient';

const taxApi = {
    getAll: () => axiosClient.get('/thue-phi'),
    create: (data) => axiosClient.post('/thue-phi', data),
    update: (id, data) => axiosClient.put(`/thue-phi/${id}`, data),
    delete: (id) => axiosClient.delete(`/thue-phi/${id}`),
};

export default taxApi;
