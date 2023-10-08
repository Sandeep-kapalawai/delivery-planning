import { AxiosRequestConfig } from 'axios';
import { merge } from 'lodash';
import { paramsSerializer } from 'destination/utilities';
import axios from '@/data/axios';
import { API_URLS } from '@/static';
import { ILocationFullAddress, ITransportProvider } from '@/interfaces';

export const getLocationFullAddress = async (config?: AxiosRequestConfig): Promise<Array<ILocationFullAddress>> => {
    const response = await axios.get(
        API_URLS.GET_LOCATION_FULL_ADDRESS(),
        merge(
            {
                params: {
                    limit: 10,
                    page: 1,
                },
            } as AxiosRequestConfig,
            config,
        ),
    );
    return response.data;
};

export const getTransportProviders = async (config?: AxiosRequestConfig): Promise<Array<ITransportProvider>> => {
    const response = await axios.get(
        API_URLS.GET_PARTIES(),
        merge(
            {
                params: {
                    limit: 10,
                    page: 1,
                },
            } as AxiosRequestConfig,
            config,
        ),
    );
    return response.data;
};

export const getFiltersAutoComplete = async (config?: AxiosRequestConfig): Promise<{ result: Array<any> }> => {
    const response = await axios.get(
        API_URLS.GET_FILTERS_AUTOCOMPLETE(),
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
    getLocationFullAddress,
    getTransportProviders,
    getFiltersAutoComplete,
};
