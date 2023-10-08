import { AxiosRequestConfig } from 'axios';
import axios from '@/data/axios';
import { API_URLS } from '@/static';
import { IFclList } from '@/interfaces';

//#region List View
export const getLclList = async (config?: AxiosRequestConfig): Promise<IFclList> => {
    const response = await axios.get(API_URLS.GET_LCL_LIST(), {
        ...config,
    });
    return response.data;
};
//#endregion

export default {
    getLclList,
};
