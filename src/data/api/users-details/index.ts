import { AxiosRequestConfig } from 'axios';
import { merge } from 'lodash';
import { paramsSerializer } from 'destination/utilities';
import axios from '@/data/axios';
import { API_URLS } from '@/static';

export const getUserDetails = async (config?: AxiosRequestConfig): Promise<any> => {
    const response = await axios.get(
        API_URLS.GET_USER_DETAILS(),
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
    getUserDetails,
};
