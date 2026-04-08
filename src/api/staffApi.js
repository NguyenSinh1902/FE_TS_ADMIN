import axiosClient from './axiosClient';

const staffApi = {
    getAll: () => axiosClient.get('/nhan-vien'),
    getPending: () => axiosClient.get('/nhan-vien/cho-duyet'),
    getOperating: () => axiosClient.get('/nhan-vien/van-hanh'),
    updateStatus: (id, status) => axiosClient.patch(`/nhan-vien/${id}/trang-thai?status=${status}`),
    delete: (id) => axiosClient.delete(`/nhan-vien/${id}`),
    updateProfile: (id, data) => axiosClient.put(`/nhan-vien/${id}/profile`, data),
    updateRole: (id, role) => axiosClient.patch(`/nhan-vien/${id}/vai-tro?role=${role}`),
};

export default staffApi;
