import { AxiosRequestConfig } from 'axios';
import axios from '@/data/axios';
import { API_URLS } from '@/static';

export const getPlanningStatus = async (config?: AxiosRequestConfig): Promise<any> => {
    const response = await axios.get(API_URLS.GET_PLANNINGSTATUS_TILES(), {
        ...config,
    });

    return response.data;
};

export const getExecutionStatus = async (config?: AxiosRequestConfig): Promise<any> => {
    const response = await axios.get(API_URLS.GET_EXECUTIONSTATUS_TILES(), {
        ...config,
    });

    return response.data;
};

export const getPriorityLevelGroups = async (config?: AxiosRequestConfig): Promise<any> => {
    const response = await axios.get(API_URLS.GET_PRIORITY_LEVELS(), {
        ...config,
    });

    return response.data;
};
export const getLastFreeDaysGroups = async (config?: AxiosRequestConfig): Promise<any> => {
    const response = await axios.get(API_URLS.GET_LASTFREEDAYS(), {
        ...config,
    });

    return response.data;
};

export default {
    getPlanningStatus,
    getLastFreeDaysGroups,
    getPriorityLevelGroups,
    getExecutionStatus,
};
