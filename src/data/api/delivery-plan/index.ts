import { AxiosRequestConfig } from 'axios';
import axios from '@/data/axios';
import { API_URLS } from '@/static';
import { ICustomizableField, ICustomizableFieldPayload, IServicePlan, IServicePlanPayload } from '@/interfaces';

export const getFCLServicePlans = async (deliveryPlanId: number | string, config?: AxiosRequestConfig): Promise<IServicePlan> => {
    const response = await axios.get(API_URLS.GET_UPDATE_FCL_SERVICE_PLANS(deliveryPlanId), config);
    return response.data;
};

export const updateFCLServicePlans = async (deliveryPlanId: number | string, payload: IServicePlanPayload, config?: AxiosRequestConfig): Promise<any> => {
    const response = await axios.post(API_URLS.GET_UPDATE_FCL_SERVICE_PLANS(deliveryPlanId), payload, config);
    return response.data;
};

export const getCustomizableField = async (config?: AxiosRequestConfig): Promise<Array<ICustomizableField>> => {
    const response = await axios.get(API_URLS.GET_UPDATE_CUSTOMIZABLE_FIELD(), config);
    return response.data;
};

export const updateCustomizableField = async (payload: { customizableFields: Array<ICustomizableFieldPayload> }, config?: AxiosRequestConfig): Promise<any> => {
    const response = await axios.post(API_URLS.GET_UPDATE_CUSTOMIZABLE_FIELD(), payload, config);
    return response.data;
};

export default {
    getFCLServicePlans,
    updateFCLServicePlans,
    getCustomizableField,
    updateCustomizableField,
};
