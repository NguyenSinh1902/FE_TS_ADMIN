import axiosClient from './axiosClient';

const authApi = {
  login: (data) => {
    return axiosClient.post('/auth/login', data);
  },
  requestOtp: (email) => {
    return axiosClient.post(`/auth/request-otp?email=${email}`);
  },
  resetPassword: (data) => {
    return axiosClient.post('/auth/reset-password', data);
  },
  register: (data) => {
    return axiosClient.post('/auth/register', data);
  },
  verifyRegister: (data) => {
    return axiosClient.post('/auth/verify-register', data);
  },
};

export default authApi;
