import axiosClient from './axiosClient';

const aiStrategyApi = {
    analyze: (ngay) => {
        const url = `/ai-strategy/analyze${ngay ? `?ngay=${ngay}` : ''}`;
        return axiosClient.post(url);
    },
    getHistory: (ngay) => {
        const url = `/ai-strategy/history${ngay ? `?ngay=${ngay}` : ''}`;
        return axiosClient.get(url);
    }
};

export default aiStrategyApi;
