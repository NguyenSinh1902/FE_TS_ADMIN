import axiosClient from './axiosClient';

const productApi = {
  getAll: () => axiosClient.get('/san-pham'),
  getByCategory: (categoryId) => axiosClient.get(`/san-pham/danh-muc/${categoryId}`),
  getToppings: () => axiosClient.get('/san-pham/toppings'),
  create: (formData) => axiosClient.post('/san-pham', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => axiosClient.put(`/san-pham/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => axiosClient.delete(`/san-pham/${id}`),
};

export default productApi;
