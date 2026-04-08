import axiosClient from './axiosClient';

const promotionApi = {
    getAll: () => axiosClient.get('/khuyen-mai'),
    getActive: () => axiosClient.get('/khuyen-mai/dang-hoat-dong'),
    getById: (id) => axiosClient.get(`/khuyen-mai/${id}`),
    create: (data) => axiosClient.post('/khuyen-mai', data),
    update: (id, data) => axiosClient.put(`/khuyen-mai/${id}`, data),
    delete: (id) => axiosClient.delete(`/khuyen-mai/${id}`),
};

export default promotionApi;
