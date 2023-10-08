import { AxiosRequestConfig } from 'axios';
import { merge } from 'lodash';
import { paramsSerializer } from 'destination/utilities';
import axios from '@/data/axios';
import { API_URLS } from '@/static';
import { IDeliveryOrders, IReasonCodes, ISendDOPayload } from '@/interfaces';
import { IUpdateDetails } from '@/components/user-actions/components/update-details/interfaces';

export const getDetails = async (config?: AxiosRequestConfig): Promise<Array<IUpdateDetails>> => {
    const response = await axios.get(
        API_URLS.GET_UPDATE_CARGO_STUFFING_DETAILS(),
        merge(
            {
                paramsSerializer,
            },
            config,
        ),
    );
    return response.data;
};

export const saveDetails = async (data: any, config?: AxiosRequestConfig): Promise<Array<IUpdateDetails>> => {
    const response = await axios.put(API_URLS.GET_UPDATE_CARGO_STUFFING_DETAILS(), data, config);

    return response.data;
};

export const getDeliveryPrograms = async (config?: AxiosRequestConfig) => {
    const response = await axios.get(
        API_URLS.GET_DELIVERY_PROGRAMS(),
        merge(
            {
                paramsSerializer,
            },
            config,
        ),
    );
    return response.data;
};

export const getSpecialPrograms = async (config?: AxiosRequestConfig) => {
    const response = await axios.get(
        API_URLS.GET_SPECIAL_PROGRAMS(),
        merge(
            {
                paramsSerializer,
            },
            config,
        ),
    );
    return response.data;
};

export const getDeliveryOrders = async (config?: AxiosRequestConfig): Promise<Array<IDeliveryOrders>> => {
    const response = await axios.get(
        API_URLS.GET_DELIVERYORDERS(),
        merge(
            {
                paramsSerializer,
            },
            config,
        ),
    );

    return response.data;
};

export const getReasonCodes = async (config?: AxiosRequestConfig): Promise<Array<IReasonCodes>> => {
    const response = await axios.get(API_URLS.GET_REASONCODES(), {
        ...config,
    });
    return response.data;
};

export const sendDeliveryOrders = async (payload: ISendDOPayload, config?: AxiosRequestConfig): Promise<{}> => {
    const response = await axios.post(API_URLS.GET_DELIVERYORDERS(), payload, config);
    return response.data;
};

export default {
    getDetails,
    saveDetails,
    getDeliveryPrograms,
    getSpecialPrograms,
    getDeliveryOrders,
    getReasonCodes,
    sendDeliveryOrders,
};
