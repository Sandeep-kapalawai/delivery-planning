import { AxiosRequestConfig } from 'axios';
import { merge } from 'lodash';
import axios from '@/data/axios';
import { API_URLS } from '@/static';
import { ICargoStuffingDetails, IFclList, CargoStuffingDocument } from '@/interfaces';

//#region List View
export const getFclList = async (config?: AxiosRequestConfig): Promise<IFclList> => {
    const response = await axios.get(API_URLS.GET_FCL_LIST(), {
        ...config,
    });
    return response.data;
};

export const getTransportDocuments = async (deliveryPlanId: number | string, config?: AxiosRequestConfig): Promise<CargoStuffingDocument> => {
    const response = await axios.get(API_URLS.GET_FCL_TRANSPORT_DOCUMENTS(deliveryPlanId), config);
    return response?.data;
};

export const importServicePlan = async (payload: any, config?: AxiosRequestConfig): Promise<IFclList> => {
    const response = await axios.post(
        API_URLS.IMPORT_SERVICE_PLAN(),
        payload,
        merge({
            headers: {
                'Content-Type': 'application/json',
            },
        }),
    );
    return response.data;
};

export const getCSAExportExcelForBulkEdit = async (config?: AxiosRequestConfig) => {
    const response = await axios.get(
        API_URLS.GET_CSA_FCL_EXPORT_BULK_EDIT(),
        merge(
            {
                responseType: 'blob',
            },
            config,
        ),
    );
    return response.data;
};

export const getConsigneeExportExcelForBulkEdit = async (config?: AxiosRequestConfig) => {
    const response = await axios.get(
        API_URLS.GET_CONSIGNEE_FCL_EXPORT_BULK_EDIT(),
        merge(
            {
                responseType: 'blob',
            },
            config,
        ),
    );
    return response.data;
};

export const getCSAExportExcelForSelectedColumns = async (config?: AxiosRequestConfig) => {
    const response = await axios.get(
        API_URLS.GET_CSA_FCL_EXPORT_SELECTED_COLUMNS(),
        merge(
            {
                responseType: 'blob',
            },
            config,
        ),
    );
    return response.data;
};

export const getCSAExportExcelForAllColumns = async (config?: AxiosRequestConfig) => {
    const response = await axios.get(
        API_URLS.GET_CSA_FCL_EXPORT_ALL(),
        merge(
            {
                responseType: 'blob',
            },
            config,
        ),
    );
    return response.data;
};

export const getConsigneeExportExcelForAllColumns = async (config?: AxiosRequestConfig) => {
    const response = await axios.get(
        API_URLS.GET_CONSIGNEE_FCL_EXPORT_ALL(),
        merge(
            {
                responseType: 'blob',
            },
            config,
        ),
    );
    return response.data;
};
//#endregion

//#region Details View
export const getCargoStuffingDetails = async (deliveryPlanId: number | string, config?: AxiosRequestConfig): Promise<ICargoStuffingDetails> => {
    const response = await axios.get(API_URLS.GET_FCL_CARGO_STUFFING_DETAILS(deliveryPlanId), config);
    return response.data;
};
//#endregion

export default {
    getFclList,
    getTransportDocuments,
    importServicePlan,
    getCSAExportExcelForBulkEdit,
    getConsigneeExportExcelForBulkEdit,
    getCSAExportExcelForSelectedColumns,
    getCSAExportExcelForAllColumns,
    getConsigneeExportExcelForAllColumns,
    getCargoStuffingDetails,
};
