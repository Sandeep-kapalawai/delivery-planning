import { AxiosRequestConfig } from 'axios';
import { merge } from 'lodash';
import { paramsSerializer } from 'destination/utilities';
import axios from '@/data/axios';
import { API_URLS } from '@/static';

export const getCustomers = async (config?: AxiosRequestConfig): Promise<{ result: Array<any> }> => {
    const response = await axios.get(
        API_URLS.GET_CUSTOMERS(),
        merge(
            {
                paramsSerializer: paramsSerializer,
            },
            config,
        ),
    );
    return response.data;
};

export default {
    getCustomers,
};
