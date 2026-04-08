import axiosClient from './axiosClient';

const categoryApi = {
  getAll: () => {
    const url = '/danh-muc';
    return axiosClient.get(url);
  },
  create: (data) => {
    const url = '/danh-muc';
    return axiosClient.post(url, data);
  },
  update: (id, data) => {
    const url = `/danh-muc/${id}`;
    return axiosClient.put(url, data);
  },
  delete: (id) => {
    const url = `/danh-muc/${id}`;
    return axiosClient.delete(url);
  },
};

export default categoryApi;
