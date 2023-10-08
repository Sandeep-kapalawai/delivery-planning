import { AxiosRequestConfig } from 'axios';
import { API_URLS } from '@/static';
import { ICustomerConfiguration } from '@/interfaces';
import axios from '@/data/axios';

export const getCustomerConfiguration = async (customerBECode: string, config?: AxiosRequestConfig): Promise<ICustomerConfiguration> => {
    const response = await axios.get(API_URLS.GET_CUSTOMER_CONFIGURATIONS(customerBECode), config);
    return response.data;
};

export default {
    getCustomerConfiguration,
};
