import axiosClient from './axiosClient';

const categoryApi = {
  getAll: () => axiosClient.get('/danh-muc'),
  create: (formData) => axiosClient.post('/danh-muc', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => axiosClient.put(`/danh-muc/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => axiosClient.delete(`/danh-muc/${id}`),
};

export default categoryApi;
