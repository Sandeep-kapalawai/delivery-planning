import axios from '@/data/axios';
import { IFavourites, ISavedFilters } from '@/interfaces';
import { API_URLS } from '@/static';
import { AxiosRequestConfig } from 'axios';
import { paramsSerializer } from 'destination/utilities';
import { merge } from 'lodash';

export const saveFilter = async (payload: any, config?: AxiosRequestConfig): Promise<any> => {
    const response = await axios.post(API_URLS.GET_POST_SAVED_FILTERS(), payload, config);
    return response.data;
};

export const getSavedFilters = async (config?: AxiosRequestConfig): Promise<{ result: ISavedFilters[] }> => {
    const response = await axios.get(
        API_URLS.GET_POST_SAVED_FILTERS(),
        merge(
            {
                paramsSerializer: paramsSerializer,
            },
            config,
        ),
    );
    return response.data;
};

export const deleteSavedFilter = async (filterId: string, config?: AxiosRequestConfig): Promise<any> => {
    const response = await axios.delete(API_URLS.UPDATE_SAVED_FILTERS(filterId), config);
    return response.data;
};

export const updateDefaultFilter = async (filterId: string, payload: any, config?: AxiosRequestConfig): Promise<any> => {
    const response = await axios.put(API_URLS.UPDATE_DEFAULT_FILTER(filterId), payload, config);
    return response.data;
};

export const getUserFavourites = async (config?: AxiosRequestConfig): Promise<IFavourites> => {
    const response = await axios.get(
        API_URLS.FAVOURITES(),
        merge(
            {
                paramsSerializer: paramsSerializer,
            },
            config,
        ),
    );
    return response.data;
};

export const saveUserFavourites = async (payload: IFavourites, config?: AxiosRequestConfig): Promise<IFavourites> => {
    const response = await axios.put(API_URLS.FAVOURITES(), payload, config);
    return response.data;
};

export default {
    saveFilter,
    getSavedFilters,
    deleteSavedFilter,
    updateDefaultFilter,
    getUserFavourites,
    saveUserFavourites,
};
