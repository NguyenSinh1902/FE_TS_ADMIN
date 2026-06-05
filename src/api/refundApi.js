import axiosClient from './axiosClient';

const refundApi = {
  getAll: () => {
    return axiosClient.get('/phieu-hoan-tra');
  },
  approveRefund: (idPhieu, isDuyet) => {
    return axiosClient.patch(`/phieu-hoan-tra/${idPhieu}/phe-duyet?isDuyet=${isDuyet}`);
  }
};

export default refundApi;
