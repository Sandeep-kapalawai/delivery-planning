import { AxiosRequestConfig } from 'axios';
import axios from '@/data/axios';
import { API_URLS } from '@/static';
import { CustomerOrderLineModel } from '@/interfaces';

export const getPOList = async (config?: AxiosRequestConfig): Promise<CustomerOrderLineModel> => {
    const response = await axios.get(API_URLS.GET_PO_LIST(), config);
    return response.data;
};
export default {
    getPOList,
};
