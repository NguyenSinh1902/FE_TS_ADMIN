import axiosClient from './axiosClient';

const productApi = {
  getAll: () => {
    const url = '/san-pham';
    return axiosClient.get(url);
  },
  getByCategory: (categoryId) => {
    const url = `/san-pham/danh-muc/${categoryId}`;
    return axiosClient.get(url);
  },
  getToppings: () => {
    const url = '/san-pham/toppings';
    return axiosClient.get(url);
  },
  create: (data) => {
    const url = '/san-pham';
    return axiosClient.post(url, data);
  },
  update: (id, data) => {
    const url = `/san-pham/${id}`;
    return axiosClient.put(url, data);
  },
  delete: (id) => {
    const url = `/san-pham/${id}`;
    return axiosClient.delete(url);
  },
};

export default productApi;
